import knex from '../database/connection'
import {Request, Response} from 'express'

class PointsController {
    
  async index (request: Request, response:Response) {
    try {

      const {city, uf, items} = request.query
      const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))
      
      const points = await knex('points')
      .join('point-items', 'points.id', '=', 'point-items.point_id')
      .whereIn('point-items.item_id', parsedItems)
      .where('city',String(city))
      .where('uf',String(uf))
      .distinct()
      .select('points.*')

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://192.168.0.85:3333/uploads/${point.image}`
        }
    })

       return response.json(serializedPoints)
    } catch(e) {
      return response.status(400).json({message:`Erro na leitura - ${e}`})
    }
}
      async show(request: Request, response:Response) {
        try {
          const {id } = request.params
          const point = await knex('points').where('id',id).first()

          if(!point){
            return response.status(400).json({message:'Point noot found'})
          }
          
          const serializedPoint =  {
              ...point,
              image_url: `http://192.168.0.85:3333/uploads/${point.image}`
        }

          const items = await knex('items')
          .join('point-items','items.id', '=', 'point-items.item_id')
          .where('point-items.point_id',id)
          .select('items.title')

          return response.json({point: serializedPoint, items})
        } catch(e) {
          return response.status(400).json({message:`Erro na leitura - ${e}`})
        }
    }

    async create (request: Request, response:Response) {

        const {
          name,
          email,
          whatsapp,
          latitude,
          longitude,
          city,
          uf,
          items
        } = request.body
      
        
        const point = {
          image: request.file.filename,
          name,
          email,
          whatsapp,
          latitude,
          longitude,
          city,
          uf
        }

        console.log(point)


        const trx = await knex.transaction() // controle de transação
        try {
            const insertsIds = await trx('points').insert(point)
      
            const point_id = insertsIds[0]
      
            const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
              return {
                item_id,
                point_id
              }
            })
      
            await trx('point-items').insert(pointItems)
            console.log(items)
      
            trx.commit()
            return response.json({
              id:point_id,
              ...point,
            })
        }catch{
          trx.rollback()
          return response.json({sucess:false})
        }
    }
}

export default PointsController