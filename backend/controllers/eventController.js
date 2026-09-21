const { Event } = require('../models');
const { Op } = require('sequelize');

exports.getEvents = async (req, res) => {
  try {
    const { search, type, year, month } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    if (type) {
      whereClause.type = type;
    }

    // Filtro para calendario mensual
    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month); // 1-indexed (Enero = 1, Diciembre = 12)

      if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
        // En JS Date, los meses son 0-indexed (Enero = 0)
        const startDate = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)); // Día 0 del siguiente mes es el último día de este mes

        whereClause.event_date = {
          [Op.between]: [startDate, endDate]
        };
      }
    }

    const events = await Event.findAll({
      where: whereClause,
      order: [['event_date', 'ASC']]
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error('Error al obtener eventos.', error);
    return res.status(500).json({ message: 'Error al obtener eventos.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error al obtener detalle de evento.', error);
    return res.status(500).json({ message: 'Error al obtener detalle de evento.' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date, type, location_link, image_url } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ message: 'El título y la fecha del evento son obligatorios.' });
    }

    const event = await Event.create({
      title,
      description,
      event_date,
      type,
      location_link,
      image_url
    });

    return res.status(201).json({ message: 'Evento creado con éxito.', event });
  } catch (error) {
    console.error('Error al crear evento.', error);
    return res.status(500).json({ message: 'Error al crear evento.' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, type, location_link, image_url } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    await event.update({
      title: title || event.title,
      description: description !== undefined ? description : event.description,
      event_date: event_date || event.event_date,
      type: type || event.type,
      location_link: location_link !== undefined ? location_link : event.location_link,
      image_url: image_url !== undefined ? image_url : event.image_url
    });

    return res.status(200).json({ message: 'Evento actualizado con éxito.', event });
  } catch (error) {
    console.error('Error al actualizar evento.', error);
    return res.status(500).json({ message: 'Error al actualizar evento.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    await event.destroy();
    return res.status(200).json({ message: 'Evento eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar evento.', error);
    return res.status(500).json({ message: 'Error al eliminar evento.' });
  }
};
