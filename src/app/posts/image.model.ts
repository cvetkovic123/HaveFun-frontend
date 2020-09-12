export class Image {
    constructor(
        public _id: string,
        public destination: string,
        public encoding: string,
        public fieldname: string,
        public filename: string,
        public localPath: string,
        public originalName: string,
        public path: string,
        public size: number
    ) {}
}
