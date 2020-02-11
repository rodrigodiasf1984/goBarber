import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    //
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }
    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: 'desc' }) // ordenação pela última notification
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id); sql
    const notification = await Notification.findByIdAndUpdate(
      // mongoDb
      req.params.id,
      {
        read: true // actualiza a coluna read para true
      },
      {
        new: true // retorna a notification para o utilizador actualizada com o novo estado
      }
    );
    return res.json(notification);
  }
}
export default new NotificationController();
