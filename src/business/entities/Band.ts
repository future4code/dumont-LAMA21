export class Band {
    constructor(
        private id: string,
        private name: string,
        private music_genre: string,
        private responsible: string
    ) { }

    public getId(): string {
        return this.id
    }

    public getName(): string {
        return this.name
    }

    public getMusic_genre(): string {
        return this.music_genre
    }

    public getResponsible(): string {
        return this.responsible
    }

    public setName(name: string) {
        this.name = name

    }

    public setMusic_genre(music_genre: string) {
        this.music_genre = music_genre
    }

    public setResponsible(responsible: string) {
        this.responsible = responsible
    }

    public static toBand(data?: any): Band | undefined {
        return (data && new Band(
            data.id,
            data.name,
            data.music_genre,
            data.responsible
        ))
    }
}

export interface BandInputDTO {
    name: string;
    music_genre: string;
    responsible: string;
}