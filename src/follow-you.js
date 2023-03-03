const ALL_CHARACTERS =
    'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const SESSION_ID_LENGTH = 12;
const TRACE_ID_BLOCKS_LENGTH = [4, 6, 3, 5];
const TRACE_ID_SEPARATION = '-';
const RETRO_SESSION_ID_LENGTH = 10;
const RETRO_TRACE_ID_BLOCKS_LENGTH = [2, 2, 3, 5];
const RETRO_TRACE_ID_SEPARATION = '_';

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
    static generateRegexSessionId(isRetro = false) {
        return new RegExp(
            '^[' +
                ALL_CHARACTERS +
                ']{' +
                (isRetro ? RETRO_SESSION_ID_LENGTH : SESSION_ID_LENGTH) +
                '}$',
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

        return (
            sessionId.match(SESSION_ID_REGEX) !== null ||
            sessionId.match(RETRO_SESSION_ID_REGEX) !== null
        );
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
                regexcharactersToRemove += String(
                    charactersToRemove[indexCharacterToRemove],
                ).toLowerCase();
            } else {
                regexcharactersToRemove += String(
                    charactersToRemove[indexCharacterToRemove],
                ).toUpperCase();
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

        for (const indexNbCharacters in TRACE_ID_BLOCKS_LENGTH) {
            for (
                let i = 0;
                i < TRACE_ID_BLOCKS_LENGTH[indexNbCharacters];
                i++
            ) {
                traceId += TRACE_ID_CHARACTERS.charAt(
                    Math.floor(Math.random() * TRACE_ID_CHARACTERS.length),
                );
            }
            if (indexNbCharacters < TRACE_ID_BLOCKS_LENGTH.length - 1)
                traceId += TRACE_ID_SEPARATION;
        }

        return traceId;
    }

    /**
     * Generate a regex for the traceId based on variable.
     * @param Boolean isRetro Define if the regex to generate is retrocompatible.
     * @returns RegExp Regex generated.
     */
    static generateRegexTraceId(isRetro) {
        let regexTraceId =
            (isRetro ? RETRO_SESSION_ID_REGEX : SESSION_ID_REGEX)
                .toString()
                .replace(/[/\\$]/g, '') +
            (isRetro ? RETRO_TRACE_ID_SEPARATION : TRACE_ID_SEPARATION);
        const rangeCharacters =
            '[' +
            (isRetro ? RETRO_TRACE_ID_CHARACTERS : TRACE_ID_CHARACTERS) +
            ']';

        const blocksLength = isRetro
            ? RETRO_TRACE_ID_BLOCKS_LENGTH
            : TRACE_ID_BLOCKS_LENGTH;
        const separation = isRetro
            ? RETRO_TRACE_ID_SEPARATION
            : TRACE_ID_SEPARATION;

        for (const indexNbCharacters in blocksLength) {
            regexTraceId +=
                rangeCharacters + '{' + blocksLength[indexNbCharacters] + '}';
            if (indexNbCharacters < blocksLength.length - 1)
                regexTraceId += separation;
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

        return (
            traceId.match(TRACE_ID_REGEX) !== null ||
            traceId.match(RETRO_TRACE_ID_REGEX) !== null
        );
    }
}

const SESSION_ID_REGEX = FollowYou.generateRegexSessionId();
const TRACE_ID_CHARACTERS = FollowYou.generateTraceIdCharacters('claude19');
const TRACE_ID_REGEX = FollowYou.generateRegexTraceId();
const RETRO_SESSION_ID_REGEX = FollowYou.generateRegexSessionId(true);
const RETRO_TRACE_ID_CHARACTERS =
    FollowYou.generateTraceIdCharacters('claude19');
const RETRO_TRACE_ID_REGEX = FollowYou.generateRegexTraceId(true);

module.exports = { FollowYou };
