export class User {
    constructor(
     public iss: string,
     public sub: string,
     public email: string,
     public _token: string,
     public _tokenExpirationDate: Date,
    ) {}
}

