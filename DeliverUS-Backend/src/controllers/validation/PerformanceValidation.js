import { check } from 'express-validator';
import { Restaurant, Performance } from '../../models/models.js';

// Should return 200 if restaurant exists (45 ms) -> copiar de las validations de Product
const checkRestaurantExists = async (value, { req }) => {
    try {
        const restaurant = await Restaurant.findByPk(req.body.restaurantId);
        if (restaurant === null) {
            return Promise.reject(new Error('The restaurantId does not exist.'));
        } else {
            return Promise.resolve();
        }
    } catch (err) {
        return Promise.reject(new Error(err));
    }
};

// This endpoint should return only one performance in the following six days for tested restaurant (1 ms)
const OnlyOneIn6Days = async (value, { req }) => {
    try {
        // iniciamos una variable para
        let comparacion = false;
        const actuacionesDeUnRestaurante = await Performance.findAll({
            where: { restaurantId: req.body.restaurantId }
        });

        // Comparar las fechas que ya existen con la nueva que vamos a crear
        // Por cada actuacion existente:
        for (const p of actuacionesDeUnRestaurante) {
            // Sacamos la fecha en cada iteracion de todas las performances
            const fechaDeUnperformance = p.appointment.getTime();
            // Sacamos la fecha de la nuevo performance que vamos a crear
            const fechaACrear = new Date(req.body.appointment).getTime();
            // Comparamos las fechas
            if (fechaDeUnperformance === fechaACrear) {
                // Si son iguales, la comparacion la ponemos a true
                comparacion = true;
                // Terminamos forzosamente el bucle porque ya hay una que coincide con la fecha
                break;
            }
        }

        if (comparacion) {
            return Promise.reject(new Error('No puede haber mas de una actuacion en un mismo dia'));
        } else {
            return Promise.resolve('OK');
        }
    } catch (err) {
        return Promise.reject(new Error(err));
    }
};

// All performances must have an id (1 ms) -> en la ruta se valida eso
const create = [
    // All performances must have a group (1 ms)
    check('group').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    // All performances must have an appointment (1 ms)
    check('appointment').exists().toDate(),
    // Should return 200 if restaurant exists (45 ms)
    check('restaurantId').exists().isInt({ min: 1 }).toInt(),
    check('restaurantId').custom(checkRestaurantExists),
    // This endpoint should return only one performance in the following six days for tested restaurant (1 ms)
    check('restaurantId').custom(OnlyOneIn6Days)
];

export { create };

