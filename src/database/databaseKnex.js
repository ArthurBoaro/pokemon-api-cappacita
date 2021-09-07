const { databaseConnection } = require('./connection')

async function salvarPokemons(pokemon) {
    
    const insertPokemon = {
        nome_pokemon: pokemon.nome,
        tipo: pokemon.tipo,
        local_origem: pokemon.origem,
        fraqueza: pokemon.fraqueza,
        resistencia: pokemon.resistencia,
        HP: 100
    }

    const result = await databaseConnection('pokemon.pokemons').insert(insertPokemon)

    if(result){
        return {
            ...pokemon,
            id: result[0]
        }
    } else {
        console.error("Error!")
        return {
            error: "Deu erro na insercao"
        }
    }
}

async function mostrarPokemon(id) {

    const result = await databaseConnection('pokemon.pokemons').where({ id })

    return result[0]
}

async function mostrarPokemons() {

    const result = await databaseConnection('pokemon.pokemons')

    return result
}

async function atualizarPokemon(id, pokemon){
    
    const updatePokemon = {
        nome_pokemon: pokemon.nome,
        tipo: pokemon.tipo,
        local_origem: pokemon.origem,
        fraqueza: pokemon.fraqueza,
        resistencia: pokemon.resistencia,
        HP: 100
    }

    const result = await databaseConnection('pokemon.pokemons').where({ id }).update(updatePokemon)

    if(result){
        return {
            ...pokemon,
            id
        }
    } else {
        console.error("Error!")
        return {
            error: "Deu erro na atualizacao"
        }
    }

}

async function deletarPokemon(id) {

    const result = await databaseConnection('pokemon.pokemons').where({ id }).del()
    console.log(result)
    return result[0]
}

async function batalhaPokemon(id1, id2){
    const superEfetivo = 40
    const efetivo = 20
    const naoEfetivo = 10
    const pokemon1 = await databaseConnection('pokemon.pokemons').where({'id': id1}).select('id','nome_pokemon', 'tipo', 'fraqueza', 'resistencia', 'hp')
    const pokemon2 = await databaseConnection('pokemon.pokemons').where({'id': id2}).select('id', 'nome_pokemon', 'tipo', 'fraqueza', 'resistencia', 'hp')
    if(pokemon1[0].hp != 0 && pokemon2[0].hp != 0){
        if(pokemon1[0].tipo == pokemon2[0].fraquza){
            pokemon2[0].hp = pokemon2[0].hp - superEfetivo
        } else if (pokemon1[0].tipo == pokemon2[0].resistencia){
            pokemon2[0].hp = pokemon2[0].hp - naoEfetivo
        } else{
            pokemon2[0].hp = pokemon2[0].hp - efetivo
        }
    }

    if(pokemon1[0].hp != 0 && pokemon2[0].hp != 0){
        if(pokemon2[0].tipo == pokemon1[0].fraquza){
            pokemon1[0].hp = pokemon1[0].hp - superEfetivo
        } else if (pokemon2[0].tipo == pokemon1[0].resistencia){
            pokemon1[0].hp = pokemon1[0].hp - naoEfetivo
        } else{
            pokemon1[0].hp = pokemon1[0].hp - efetivo
        }
    }

    if(pokemon1[0].hp < 0) pokemon1[0].hp = 0
    if(pokemon2[0].hp < 0) pokemon2[0].hp = 0
    const result1 = await databaseConnection('pokemon.pokemons').where({'id': id1}).update({ 'hp': pokemon1[0].hp })
    const result2 = await databaseConnection('pokemon.pokemons').where({'id': id2}).update({ 'hp': pokemon2[0].hp })
    return `O pokemon ${pokemon1[0].nome_pokemon} ficou com ${pokemon1[0].hp} de HP.\n O pokemon ${pokemon2[0].nome_pokemon} ficou com ${pokemon2[0].hp} de HP.`

}

async function curarPokemon(id){
    const pokemon =  await databaseConnection('pokemon.pokemons').where({ id })
    pokemon[0].hp = pokemon[0].hp + 20
    
    if(pokemon[0].hp > 100) {
        pokemon[0].hp = 100
        const result = await databaseConnection('pokemon.pokemons').where({ id }).update({ 'hp': pokemon[0].hp })
        return `O ${pokemon[0].nome_pokemon} foi totalmente curado e agora está com vida cheia (${pokemon[0].hp} HP), portanto não é mais possível curá-lo.`
    } else {
        const result = await databaseConnection('pokemon.pokemons').where({ id }).update({ 'hp': pokemon[0].hp })
        return `O ${pokemon[0].nome_pokemon} foi curado em 20 de HP com uma poção e agora está com ${pokemon[0].hp} HP.`
    }


}



module.exports = { salvarPokemons, mostrarPokemon, mostrarPokemons, atualizarPokemon, deletarPokemon, batalhaPokemon, curarPokemon }