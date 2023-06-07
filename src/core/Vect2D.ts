export class Vec2D {

    constructor(
        public u: number = 0,
        public v: number = 0,
        public w: number = 1,
    ) { }

    public clone(): Vec2D {

        return new Vec2D(this.u, this.v, this.w);
    }
}
