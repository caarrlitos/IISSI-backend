import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
      order: [['status', 'ASC'], [{ model: RestaurantCategory, as:
        'restaurantCategory' }, 'name', 'ASC']]
        
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory',
          order: [['status', 'ASC'], [{ model: RestaurantCategory, as:
            'restaurantCategory' }, 'name', 'ASC']]

            //order: [['discount', 'DESC']] for discount exam

        }]
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
try {
  // Fecha de hoy a medianoche
  const hoy = new Date(Date.now());
  hoy.setHours(0, 0, 0, 0); // H:M:S:MS

  // Fecha dentro de una semana a medianoche
  const limite1semana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  limite1semana.setHours(0, 0, 0, 0);

  const restaurants = await Restaurant.findAll({
    attributes: { exclude: ['userId'] },
    where: { userId: req.user.id },
    include: [
      {
        model: RestaurantCategory,
        as: 'restaurantCategory',
      },
      // SOLUCION
      {
        model: Performance,
        as: 'performances',
        where: {
          appointment: {
            [Op.and]: [{ [Op.gte]: hoy }, { [Op.lt]: limite1semana }],
          },
        },
        required: false, // Para los restaurantes que no tengan actuaciones también sean visibles
      },
    ],
  });

  res.json(restaurants);
} catch (err) {
  res.status(500).send(err);
}
*/

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = req.user.id // usuario actualmente autenticado
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const orderingBy = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    restaurant.sortByPrice = !restaurant.sortByPrice // Si el valor actual de "sortByPrice" es "Falso", pasará a "True"
  // y viceversa cada vez que se pulse sobre el botón, de manera que se ordenen los productos del restaurante de una manera u otra.
    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
      res.status(500).send(err)
  }
 }
  

const show = async function (req, res) {
  // Only returns PUBLIC information of restaurants
  try {

    let restaurant = await Restaurant.findByPk(req.params.restaurantId)
      const orderingBy = restaurant.orderByPrice ?
        [[{ model: Product, as: 'products' }, 'price', 'ASC']] :
        [[{ model: Product, as: 'products' }, 'order', 'ASC']]
      restaurant = await Restaurant.findByPk(req.params.restaurantId, {
    attributes: { exclude: ['userId'] },
    include: [{
      model: Product,
      as: 'products',
      include: { model: ProductCategory, as: 'productCategory' }
    },
    {
      model: RestaurantCategory,
      as: 'restaurantCategory'
    }],
    order: [[{ model: Product, as: 'products' }, 'order', 'ASC']] // orderingBy
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted restaurant id.' + req.params.restaurantId
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const alterStatus = async function (req, res) {
  const t = await sequelizeSession.transaction()
  try {
  // Buscamos el restaurante que vamos a actulizar con la petición
  const RestaurantToUpdate = await
  Restaurant.findByPk(req.params.restaurantId)
  // si su estado es offline cambia a online, en otro caso a offline
  if (RestaurantToUpdate.status === 'online') {
  RestaurantToUpdate.status = 'offline'
  } else {
  RestaurantToUpdate.status = 'online'
  }
  // guardamos la nueva informacion del restaurante en la BD
  await RestaurantToUpdate.save({ transaction: t })
  await t.commit()
  res.json(RestaurantToUpdate)
  } catch (err) {
  res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  update,
  destroy,
  alterStatus
}
export default RestaurantController
