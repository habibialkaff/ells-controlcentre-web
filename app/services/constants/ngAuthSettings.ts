interface IAuthSettings {
    apiServiceBaseUri: string;
    clientId: string;
}

app.constant('ngAuthSettings', {
    apiServiceBaseUri: 'http://ells-api-demo.azurewebsites.net/',
    clientId: 'ells-ControlCentre-Demo'
}); 