const ID_LENGTH = 20;
const ID_NB_SEPARATION = 4;

class FollowYou {
    static ID_CHARACTERS =
        'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    static ID_SEPARATION = '-';
    static ID_INDEX_SEPARATION = Math.trunc(ID_LENGTH / ID_NB_SEPARATION);
    static ID_REGEX = FollowYou.generateRegexTraceId();

    /**
     * Generate a random traceId based on variables.
     * @returns String TraceId generated.
     */
    static generateTraceId() {
        let traceId = '';

        for (let i = 1; i <= ID_LENGTH + ID_NB_SEPARATION; i++) {
            if (i % FollowYou.ID_INDEX_SEPARATION === 0) {
                traceId += FollowYou.ID_SEPARATION;
            } else {
                traceId += FollowYou.ID_CHARACTERS.charAt(
                    Math.floor(Math.random() * FollowYou.ID_CHARACTERS.length),
                );
            }
        }

        return traceId;
    }

    /**
     * Generate a regex for the traceId based on variable.
     * @returns RegExp Regex generated.
     */
    static generateRegexTraceId() {
        let regexTraceId = '';
        const rangeCharacters = '[' + FollowYou.ID_CHARACTERS + ']';

        for (let i = 1; i <= ID_LENGTH + ID_NB_SEPARATION; i++) {
            if (i % FollowYou.ID_INDEX_SEPARATION === 0) {
                regexTraceId += FollowYou.ID_SEPARATION;
            } else {
                regexTraceId += rangeCharacters;
            }
        }

        return new RegExp(regexTraceId);
    }

    /**
     * Check if the traceId match the regex generated.
     * @param {string} traceId
     * @returns Boolean true if traceId match regex.
     */
    static isTraceId(traceId) {
        if (!traceId) {
            return false;
        }

        if (typeof traceId !== 'string') {
            return false;
        }

        return traceId.match(FollowYou.ID_REGEX) !== null;
    }
}

module.exports = { FollowYou };
