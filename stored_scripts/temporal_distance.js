module.exports = {
    index: 'temporal_distance',
    body: {
        script : {
            lang: 'painless',
            source: require('./sources/temporal_distance.painless')
        }
    }
};
