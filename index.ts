import * as express from "express";
import { urlencoded, json } from 'body-parser';
import { Router, Request, Response, NextFunction } from 'express';
import { ClaymoreApi } from './api/claymore-api';
import { EnergyRoutes } from "./api/energy-routes";
import { ClaymoreRoutes } from "./api/claymore-routes";
import './models/connect';
import { discoverDevice } from "./api/device";
import { RigRoutes } from "./api/rig-routes";

let app = express();

let port = 3005;

app.use(json());
app.use(urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET")
    next();
});

app.use(EnergyRoutes);
app.use(ClaymoreRoutes);
app.use(RigRoutes);

app.listen(port, "0.0.0.0", () => console.log(`Running app: localhost:${port}`));
