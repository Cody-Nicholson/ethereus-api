import { Router, Request, Response, NextFunction } from 'express';
import { ClaymoreApi } from './claymore-api';

let router = Router();

const api = new ClaymoreApi();

router.get('/claymore/snapshot/:ip', (req: Request, res: Response) => {
    let { ip } = req.params;

    api.getSnapshot(ip)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/stats/:ip/:alias', (req: Request, res: Response) => {
    let { ip, alias } = req.params;
    api.getStats(ip, alias)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/fans/:ip/:alias/timed', (req: Request, res: Response) => {
    let { ip, alias } = req.params;
    api.getSeriesByProp(ip, alias, 'fans')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error Caught', err)
            res.status(400).json(err);
        })
});

router.get('/claymore/temps/:ip/:alias/timed', (req: Request, res: Response) => {
    let { ip, alias } = req.params;

    api.getSeriesByProp(ip, alias, 'temps')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/eth/:ip/:alias/timed', (req: Request, res: Response) => {
    let { ip, alias } = req.params;
    console.log('get Data');
    api.getSeriesByProp(ip, alias, 'ethHash')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/dual/:ip/:alias/timed', (req: Request, res: Response) => {
    let { ip, alias } = req.params;
    api.getSeriesByProp(ip, alias, 'dcrHash')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/fans/:ip/:alias', (req: Request, res: Response) => {
    let { ip, alias } = req.params;

    api.getFans(ip, alias)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/eth/:ip/:alias', (req: Request, res: Response) => {
    let { ip, alias } = req.params;

    api.getEthereumHash(ip, alias)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/claymore/dual/:ip/:alias', (req: Request, res: Response) => {
    let { ip, alias } = req.params;

    api.getDualHash(ip, alias)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});



export const ClaymoreRoutes = router;