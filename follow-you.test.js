const { FollowYou } = require('./follow-you');
const ID_LENGTH = 20;
const ID_NB_SEPARATION = 4;

describe('Follow you', () => {
    console.log(FollowYou.ID_INDEX_SEPARATION);

    describe('generate trace id', () => {
        const traceId = FollowYou.generateTraceId();

        it('should match total length', () => {
            expect(traceId.length).toEqual(ID_LENGTH + ID_NB_SEPARATION);
        });

        it('should have the same number of separation', () => {
            expect(traceId.split(FollowYou.ID_SEPARATION).length).toEqual(
                ID_NB_SEPARATION + 1,
            );
        });

        it('should have the same number of random characters', () => {
            expect(
                traceId
                    .split(FollowYou.ID_SEPARATION)
                    .reduce(
                        (total, characters) => total + characters.length,
                        0,
                    ),
            ).toEqual(ID_LENGTH);
        });
    });

    describe('generate regex trace id', () => {
        const regexTraceId = FollowYou.generateRegexTraceId();
        const stringRegexTraceId = regexTraceId.toString();

        it('should be a regex', () => {
            expect(regexTraceId instanceof RegExp).toBe(true);
        });

        it('should have the same number of separation', () => {
            expect(
                stringRegexTraceId.split(FollowYou.ID_SEPARATION).length,
            ).toEqual(ID_NB_SEPARATION + 1);
        });

        it('should have the same number of random characters', () => {
            expect(
                [...stringRegexTraceId.matchAll(FollowYou.ID_SEPARATION)]
                    .length,
            ).toEqual(ID_NB_SEPARATION);
        });
    });

    describe('Check if traceId is correct', () => {
        it('should be true', () => {
            expect(FollowYou.isTraceId(FollowYou.generateTraceId())).toBe(true);
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
