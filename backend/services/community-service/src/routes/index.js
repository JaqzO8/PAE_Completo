const express = require('express');
const router = express.Router();

const communityRoutes = require('./communityRoutes');
const messageRoutes = require('./messageRoutes');
const resourceRoutes = require('./resourceRoutes');

const ChallengeController = require('../controllers/challengeController');
const InvitationController = require('../controllers/invitationController');
const FriendshipController = require('../controllers/friendshipController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyRole, verifyTeacherOfCommunity } = require('../middlewares/roleMiddleware');

/*
|--------------------------------------------------------------------------
| Community core routes
|--------------------------------------------------------------------------
*/
router.use('/', communityRoutes);
router.use('/', messageRoutes);
router.use('/', resourceRoutes);

/*
|--------------------------------------------------------------------------
| Challenges
|--------------------------------------------------------------------------
*/
router.post('/:id/challenges', verifyToken, verifyTeacherOfCommunity, ChallengeController.create);
router.get('/:id/challenges', verifyToken, ChallengeController.list);
router.put('/:id/challenges/:challengeId', verifyToken, verifyTeacherOfCommunity, ChallengeController.update);

/*
|--------------------------------------------------------------------------
| Invitations
|--------------------------------------------------------------------------
*/
router.post('/:id/invite', verifyToken, verifyRole('docente'), InvitationController.send);
router.get('/invitations', verifyToken, InvitationController.getMyInvitations);
router.post('/invitations/:id/accept', verifyToken, InvitationController.accept);
router.post('/invitations/:id/reject', verifyToken, InvitationController.reject);

/*
|--------------------------------------------------------------------------
| Friendships
|--------------------------------------------------------------------------
*/
router.post('/friends/request', verifyToken, FriendshipController.sendRequest);
router.get('/friends', verifyToken, FriendshipController.list);
router.get('/users/search', verifyToken, FriendshipController.searchUsers);

module.exports = router;
