

import { Router, Request, Response, NextFunction } from 'express';
import { RigApi } from './rigs-api';

let router = Router();

const api = new RigApi();

router.get('/rigs', (req: Request, res: Response) => {
   
    api.getAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.get('/rigs/:ip', (req: Request, res: Response) => {
    let { ip } = req.params;

    api.get(ip)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.put('/rigs/:ip', (req: Request, res: Response) => {
    let { ip } = req.params;
    let rig = req.body;
    api.put(rig)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.delete('/rigs/:ip', (req: Request, res: Response) => {
    let { ip } = req.params;
    api.delete(ip)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

export const RigRoutes = router;