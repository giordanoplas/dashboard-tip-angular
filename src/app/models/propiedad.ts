export class Propiedad {
    constructor(
        public codigo: number,
        public nombre: string,
        public direccion: string,
        public descripcion: string,
        public monedaID: number,
        public precio: string,
        public habitaciones: number,
        public banos: number,
        public area: string,
        public medidaID: number,
        public estadoID: number,
        public categoriaID: number,
        public ubicacionID: number,
        public destacado: any,
        public vendido: any,
        public alquilado: any,
        public slider: any,
        public imagen: string,
        public principal: any
    ) {}
}