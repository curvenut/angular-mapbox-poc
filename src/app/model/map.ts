

export class Layers {
    static MARKERS = new Layers('markers', 'markers-source');
    static POINTS = new Layers('points', 'points-source');

    toString() {
        return this.name;
    }
    private constructor(public name: string, public sourceName: string) {}
}

