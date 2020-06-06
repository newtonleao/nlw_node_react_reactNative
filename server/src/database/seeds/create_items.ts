import Knex from 'knex'

export async function seed(knex: Knex){
   await knex('items').insert([
        {title:'Lâmpadas', image:'lampadas.svg'},
        {title:'Pilhas e baterias', image:'baterias.svg'},
        {title:'Papéis e papelão', image:'papeis-papelao.svg'},
        {title:'Residuos Eletrônicos', image:'eletronicos.svg'},
        {title:'Residuos Orgânico', image:'organicos.svg'},
        {title:'Oléo de cozinha', image:'oleo.svg'},
        
    ])
}