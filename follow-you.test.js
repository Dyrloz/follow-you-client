const { FollowYou } = require('./follow-you');
const ALL_CHARACTERS =
    'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const SESSION_ID_LENGTH = 12;
const TRACE_ID_BLOCK_LENGTH = [4, 6, 3, 5];
const TRACE_ID_SEPARATION = '-';

describe('Follow you', () => {
    describe('generate session id', () => {
        const sessionId = FollowYou.generateSessionId();

        it('should use ALL_CHARACTERS with a minimum of 40 different characters', () => {
            expect(ALL_CHARACTERS.length > 39).toEqual(true);
        });

        it('should match total length', () => {
            expect(sessionId.length).toEqual(SESSION_ID_LENGTH);
        });

        it('should match regex with all characters', () => {
            const regex = new RegExp(
                '[' + ALL_CHARACTERS + ']{' + SESSION_ID_LENGTH + '}',
            );
            expect(sessionId).toMatch(regex);
        });
    });

    describe('generate regex session id', () => {
        const regexSessionId = FollowYou.generateRegexSessionId();

        it('should be a regex', () => {
            expect(regexSessionId instanceof RegExp).toBe(true);
        });

        it('should have the same number of characters as defined in SESSION_ID_LENGTH', () => {
            const regex = new RegExp(
                '^[' + ALL_CHARACTERS + ']{' + SESSION_ID_LENGTH + '}$',
            );
            expect(regexSessionId).toEqual(regex);
        });
    });

    describe('Check if sessionId is correct', () => {
        it('should be true', () => {
            expect(FollowYou.isSessionId(FollowYou.generateSessionId())).toBe(
                true,
            );
        });

        it('with wrong pattern should be false', () => {
            expect(FollowYou.isSessionId('hiitisabadpattern')).toBe(false);
        });

        it('with number should be false', () => {
            expect(FollowYou.isSessionId(321)).toBe(false);
        });

        it('with empty string should be false', () => {
            expect(FollowYou.isSessionId('')).toBe(false);
        });

        it('with null should be false', () => {
            expect(FollowYou.isSessionId(null)).toBe(false);
        });

        it('with nothing should be false', () => {
            expect(FollowYou.isSessionId()).toBe(false);
        });
    });

    describe('generate id characters', () => {
        it('with "dog" as characters to remove, it should remove "d", "o" and "G"', () => {
            const idCharacters = ALL_CHARACTERS.replace(/[doG]/g, '');

            expect(FollowYou.generateTraceIdCharacters('dog')).toEqual(
                idCharacters,
            );
        });

        it('with "alpa" as characters to remove, it should remove "a", "l", "P" and "A"', () => {
            const idCharacters = ALL_CHARACTERS.replace(/[alPA]/g, '');

            expect(FollowYou.generateTraceIdCharacters('alpa')).toEqual(
                idCharacters,
            );
        });

        it('with an empty as characters to remove, it should remove nothing', () => {
            expect(FollowYou.generateTraceIdCharacters('')).toEqual(
                ALL_CHARACTERS,
            );
        });

        it('with null as characters to remove, it should remove nothing', () => {
            expect(FollowYou.generateTraceIdCharacters(null)).toEqual(
                ALL_CHARACTERS,
            );
        });
    });

    describe('generate trace id', () => {
        describe('with a sessionId given in paramater', () => {
            const sessionId = FollowYou.generateSessionId();
            const traceId = FollowYou.generateTraceId(sessionId);

            it('should match total length', () => {
                expect(traceId.length).toEqual(
                    SESSION_ID_LENGTH +
                        TRACE_ID_BLOCK_LENGTH.reduce(
                            (total, nbCharacter) => total + nbCharacter,
                            0,
                        ) +
                        TRACE_ID_BLOCK_LENGTH.length,
                );
            });

            it('should have the same number of separation', () => {
                expect(traceId.split(TRACE_ID_SEPARATION).length).toEqual(
                    TRACE_ID_BLOCK_LENGTH.length + 1,
                );
            });

            it('should have sessionId at the beginning', () => {
                const splitTraceId = traceId.split(TRACE_ID_SEPARATION);
                expect(splitTraceId[0]).toEqual(sessionId);
            });

            it('should the same number of random characters as defined in TRACE_ID_BLOCK_LENGTH separated by TRACE_ID_SEPARATION', () => {
                const splitTraceId = traceId.split(TRACE_ID_SEPARATION);
                for (const indexNbCharacter in TRACE_ID_BLOCK_LENGTH) {
                    expect(
                        splitTraceId[Number.parseInt(indexNbCharacter) + 1]
                            .length,
                    ).toEqual(TRACE_ID_BLOCK_LENGTH[indexNbCharacter]);
                }
            });
        });

        describe('with a wrong sessionId given in paramater', () => {
            it('empty : should return null', () => {
                expect(FollowYou.generateTraceId('')).toEqual(null);
            });

            it('undefined : should return null', () => {
                expect(FollowYou.generateTraceId(undefined)).toEqual(null);
            });

            it('null should return null', () => {
                expect(FollowYou.generateTraceId(null)).toEqual(null);
            });
        });
    });

    describe('generate regex trace id', () => {
        const regexSessionId = FollowYou.generateRegexSessionId();
        const regexTraceId = FollowYou.generateRegexTraceId();
        const stringRegexTraceId = regexTraceId.toString();

        it('should be a regex', () => {
            expect(regexTraceId instanceof RegExp).toBe(true);
        });

        it('should have the same number of separation', () => {
            expect(
                stringRegexTraceId.split(TRACE_ID_SEPARATION).length,
            ).toEqual(TRACE_ID_BLOCK_LENGTH.length + 1);
        });

        it('should have regexSessionId at the beginning', () => {
            const splitRegexTraceId =
                stringRegexTraceId.split(TRACE_ID_SEPARATION);
            expect(splitRegexTraceId[0]).toMatch(
                regexSessionId.toString().replace(/[/\\$]/g, ''),
            );
        });

        it('should the same number of random characters as defined in TRACE_ID_BLOCK_LENGTH, separated by TRACE_ID_SEPARATION', () => {
            const splitRegexTraceId =
                stringRegexTraceId.split(TRACE_ID_SEPARATION);
            for (const indexNbCharacter in TRACE_ID_BLOCK_LENGTH) {
                const regex = new RegExp(
                    '\\{' + TRACE_ID_BLOCK_LENGTH[indexNbCharacter] + '\\}',
                );
                expect(
                    splitRegexTraceId[Number.parseInt(indexNbCharacter) + 1],
                ).toMatch(regex);
            }
        });
    });

    describe('Check if traceId is correct', () => {
        it('should be true', () => {
            expect(
                FollowYou.isTraceId(
                    FollowYou.generateTraceId(FollowYou.generateSessionId()),
                ),
            ).toBe(true);
        });

        it('with wrong pattern should be false', () => {
            expect(FollowYou.isTraceId('hiitisabadpattern')).toBe(false);
        });

        it('with number should be false', () => {
            expect(FollowYou.isTraceId(321)).toBe(false);
        });

        it('with empty string should be false', () => {
            expect(FollowYou.isTraceId('')).toBe(false);
        });

        it('with null should be false', () => {
            expect(FollowYou.isTraceId(null)).toBe(false);
        });

        it('with nothing should be false', () => {
            expect(FollowYou.isTraceId()).toBe(false);
        });
    });
});
