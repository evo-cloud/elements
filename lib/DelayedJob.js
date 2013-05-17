var Class = require('./Class');

module.exports = Class({
    constructor: function (jobFn) {
        this.jobFn = jobFn;
    },
    
    schedule: function (delay) {
        if (!this.timer) {
            delay = parseInt(delay);
            if (!isFinite(delay)) {
                delay = 0;
            }
            this.timer = setTimeout(this.jobFn, delay);
        }
        return this;
    },
    
    cancel: function () {
        if (this.timer) {
            clearTimeout(this.timer);
            delete this.timer;
        }
        return this;
    }
});