const ALL_CHARACTERS =
    'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const SESSION_ID_LENGTH = 12;
const TRACE_ID_BLOCK_LENGTH = [4, 6, 3, 5];
const TRACE_ID_SEPARATION = '-';

/**
 * Class used to generate and verify sessionId and traceId.
 */

class FollowYou {
    /**
     * Generate a sesion ID from ALL_CHARACTERS with Session id length.
     * @returns String Session id generated.
     */
    static generateSessionId() {
        let sessionId = '';

        for (let i = 0; i < SESSION_ID_LENGTH; i++) {
            sessionId += ALL_CHARACTERS.charAt(
                Math.floor(Math.random() * ALL_CHARACTERS.length),
            );
        }

        return sessionId;
    }

    /**
     * Generate a regex for the sessionId based on variable.
     * @returns RegExp Regex generated.
     */
    static generateRegexSessionId() {
        return new RegExp(
            '^[' + ALL_CHARACTERS + ']{' + SESSION_ID_LENGTH + '}$',
        );
    }

    /**
     * Check if the sessionId match the regex.
     * @param {string} sessionId
     * @returns Boolean true if sessionId match regex.
     */
    static isSessionId(sessionId) {
        if (!sessionId) {
            return false;
        }

        if (typeof sessionId !== 'string') {
            return false;
        }

        return sessionId.match(SESSION_ID_REGEX) !== null;
    }

    /**
     * Generate characters used for the trace id, by removing the charactersToRemove from ALL_CHARACTERS.
     * @returns String containing characters.
     */
    static generateTraceIdCharacters(charactersToRemove) {
        let traceIdCharacters = ALL_CHARACTERS;
        let regexcharactersToRemove = '';

        for (let indexCharacterToRemove in charactersToRemove) {
            if (indexCharacterToRemove < charactersToRemove.length / 2) {
                regexcharactersToRemove +=
                    charactersToRemove[indexCharacterToRemove].toLowerCase();
            } else {
                regexcharactersToRemove +=
                    charactersToRemove[indexCharacterToRemove].toUpperCase();
            }
        }

        const regex = new RegExp('[' + regexcharactersToRemove + ']', 'g');

        return traceIdCharacters.replace(regex, '');
    }

    /**
     * Generate a random traceId based on variables.
     * @param {String} sessionId Session Id to generate a trace id.
     * @returns String TraceId generated.
     */
    static generateTraceId(sessionId) {
        if (!sessionId) {
            return null;
        }
        let traceId = sessionId + TRACE_ID_SEPARATION;

        for (const indexNbCharacters in TRACE_ID_BLOCK_LENGTH) {
            for (let i = 0; i < TRACE_ID_BLOCK_LENGTH[indexNbCharacters]; i++) {
                traceId += TRACE_ID_CHARACTERS.charAt(
                    Math.floor(Math.random() * TRACE_ID_CHARACTERS.length),
                );
            }
            if (indexNbCharacters < TRACE_ID_BLOCK_LENGTH.length - 1)
                traceId += TRACE_ID_SEPARATION;
        }

        return traceId;
    }

    /**
     * Generate a regex for the traceId based on variable.
     * @returns RegExp Regex generated.
     */
    static generateRegexTraceId() {
        let regexTraceId =
            SESSION_ID_REGEX.toString().replace(/[/\\$]/g, '') +
            TRACE_ID_SEPARATION;
        const rangeCharacters = '[' + TRACE_ID_CHARACTERS + ']';

        for (const indexNbCharacters in TRACE_ID_BLOCK_LENGTH) {
            regexTraceId +=
                rangeCharacters +
                '{' +
                TRACE_ID_BLOCK_LENGTH[indexNbCharacters] +
                '}';
            if (indexNbCharacters < TRACE_ID_BLOCK_LENGTH.length - 1)
                regexTraceId += TRACE_ID_SEPARATION;
        }

        regexTraceId += '$';

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

        return traceId.match(TRACE_ID_REGEX) !== null;
    }
}

const SESSION_ID_REGEX = FollowYou.generateRegexSessionId();
const TRACE_ID_CHARACTERS = FollowYou.generateTraceIdCharacters('claude19');
const TRACE_ID_REGEX = FollowYou.generateRegexTraceId();

module.exports = { FollowYou };
