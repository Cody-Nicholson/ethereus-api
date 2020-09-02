

import { Router, Request, Response, NextFunction } from 'express';
import { getDevice } from './device';
import { EnergySnapshot, EnergyReading } from './energy';
import { EnergyApi } from './energy-api';



let router = Router();

router.get('/energy', (req: Request, res: Response) => {
    let deviceName;
    getDevice('')
        .then(device => {
            deviceName = device.name
            return <EnergySnapshot>device.emeter.getRealtime();
        })
        .then(reading => {
            let meter = new EnergyReading(reading, deviceName);
            res.json(meter);
        })
        .catch(err => {
            res.status(400).json(err)
        });
});

router.get('/energy/power/:ip/:alias', (req: Request, res: Response) => {
    let { ip, alias } = req.params
    let api = new EnergyApi();
    api.getPowerSeries(ip, alias)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).render(err);
        })
});

router.get('/energy/power/:ip/:alias/timed', (req: Request, res: Response) => {
    let { ip, alias } = req.params
    let api = new EnergyApi();
    api.getSeriesByProp(ip, alias, 'power')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).render(err);
        })
});


export const EnergyRoutes = router;