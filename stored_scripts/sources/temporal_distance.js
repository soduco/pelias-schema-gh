/*
  Compute a decay coefficient inversely proportional to the time difference
  between a time window and a document valid time, both expressed as a number of
  days since Epoch.  
  Two additional parameters, scale and softness, are provided to adjust the
  decay strengh.

  With A = [a,b] a valid time and W = [x,y] a time window:
    1. compute dt the time differente between A and W:
       Δt = max{ max{a,x} - min{b,y}, 0}
    2. apply an ES exponential decay to obtain a score in ]0,1]. Decay is
       guaranteed to be 0.5 at scale * softness.

  Δt = 0 if A and W touch or overlap, otherwise Δt is a positive number
  corresponding to smallest number of days seperating A and W.

  The maximum possible number of days since Epoch is used as a substitute for
  +/- infinity when dealing with half-bounded and unbounded intevals.

  Missing intervals are interpreted as fully unbounded. 
  Thus a document with no valid time is considered as *always valid*.
*/
//lang: painless

module.exports = `
    long getOrElse(def v, def orelse){
        v == null ? orelse : v;
    }

    long fieldOrElse(def field, def orelse, def doc){
        !doc.containsKey(field) || doc[field].empty ? orelse : doc[field].value;
    }

    long ms_in_day = 86400000;
    long min_days = Long.MIN_VALUE / ms_in_day;
    long max_days = Long.MAX_VALUE / ms_in_day;

    long ws = getOrElse(params.window_start, min_days);
    long we = getOrElse(params.window_end, max_days);
    long vs = fieldOrElse('validtime.start', min_days, doc);
    long ve = fieldOrElse('validtime.end', max_days, doc);

    def dt =  Math.max(vs, ws) - Math.min(ve, we);

    // dt <= 0 means that intervals are touching or overlapping
    // In that case the score is always 1.
    if( dt <= 0){
        return 1.0
    }

    def scale = getOrElse(params.scale, 0.0) * getOrElse(params.softness, 0.0);

    // Warning: will return NaN if intervals overlap and scale is 0 !
    decayNumericExp(0, scale, 0, 0.5, dt);`
