import Router from 'express';
import { createUnactivatedUser, findUnactivatedUsersBySro } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { generateReferenceId } from '../utils.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const referrals = await findUnactivatedUsersBySro(req.user.id);
        return res.status(200).json({
            referrals: referrals.map(({ id, reference_id, created_at }) => ({
                id, referenceId: reference_id, createdAt: created_at
            }))
        })
    } catch (e) {
        return res.status(500).json({
            error: "Unactivated referrals could not be retrieved."
        })
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const referenceId = generateReferenceId()
        await createUnactivatedUser(referenceId, req.user.id);
        return res.status(200).json({ referenceId });
    } catch (e) {
        return res.status(500).json({ error: "A new reference ID could not be generated." });
    }
});

export default router;