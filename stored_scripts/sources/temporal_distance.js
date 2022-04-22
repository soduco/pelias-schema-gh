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

    // Don't bother going any further if one of the interval is unbounded.
    if ( ws == min_days && we == max_days || 
        vs == min_days && ve == max_days ){
        return 1.0;
    }

    double softness = params.softness == null ? 0 : params.softness;
    double scale = getOrElse(params.scale, 0) * softness;
    scale = Math.max(scale, 0);

    double dt =  Math.max(vs, ws) - Math.min(vs, we);
    decayNumericExp(0, scale, 0, 0.5, dt);`