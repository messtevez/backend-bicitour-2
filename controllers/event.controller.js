const Event = require('./../models/Event')

const createEvent = async( req, res) => {
    const {name, date, hour, location, cost, distance, capacity, category} = req.body
    const img = req.file
    console.log(req.name)
    console.log("Entro")
    try{

        if(!file)return res.status(400).json({
            ok:false,
            msg:'hey event Image is mandatory'
        })

        const dbEvent = new Event({
            name: name,
            date: date, 
            hour: hour, 
            location: location, 
            cost: cost, 
            distance: distance,
            capacity: capacity, 
            category: category,
            attendees: [],
            eventImg: img
        })
        await dbEvent.save()
        
        return res.status(201).json({
            ok: true, 
            msg: 'Evento creado exitosamente'
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento, por favor contacta a soporte.'
        })
    }
}

const getAllEvents = async( req, res) => {
    try{
        const events = await Event.find().select('name')
        
        return res.status(200).json({
        ok: true,
        events: events
    }) 
    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error encontrando el evento, por favor contacta a soporte.'
        })
    }
}

const getEventById = async(req, res) => {
    const id = req.params.id
    try{
        const event = await Event.findById(id); 
        if(!event){
            return res.status(404).json({
                ok: false,
                msg:'Event Not Found'
            })
        }
        return res.status(202).json({
            ok: true, 
            msg: 'File found',
            event: event
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Could not get event, please try again'
        })
    }
}

const updateEventById = async(req, res) =>{

    const id = req.params.id

    const name = req.body.name; 
    const date = req.body.date;
    const hour = req.body.hour; 
    const location = req.body.location; 
    const cost = req.body.cost; 
    const distance = req.body.distance; 
    const capacity = req.body.capacity; 
    const category = req.body.category; 

    try{
        const updatedData = {}

        if(name)updatedData.name = name; 
        if(date)updatedData.date = date; 
        if(hour)updatedData.hour = hour; 
        if(location)updatedData.location = location; 
        if(cost)updatedData.cost = cost; 
        if(distance)updatedData.distance = distance; 
        if(capacity)updatedData.capacity = capacity; 
        if(category)updatedData.category = category; 

        const event = await Event.findByIdAndUpdate(id, updatedData)

        if(!event) return res.status(404).json({
            ok: false,
            msg: 'Event not found for update'
        })
        return res.status(200).json({
            ok:  true,
            msg: 'Event updated successfuly',
            event: event
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'server error updating the vent, contact support'
        })
    }
}

const deleteEventById = async(req, res) => {
    const {id} = req.params.id
    try{
        const event = await Event.findOneAndDelete({_id: id})
        if(event){
            return res.status(200).json({
                ok: true,
                msg: `El evento ${event.name} ha sido eliminado.`
            })
        }
        return res.status(400).json({
            ok: false, 
            msg: 'No se encontro el evento.'
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor al eliminar el evento, por favor contacta a soporte.'
        })
    }
}

const capacityValidator = async(req, res) => {
    const idEvent = req.params.id
    const idUser = req.body.id
    try{
        const valEvent = await Event.findOne({_id: idEvent})

        if(!valEvent){
            return res.status(400).json({
                ok: false,
                msg: "event not found"
            })
        }
        
        const exists = valEvent.attendees.find(x => x == idUser)

        if(exists){
            return res.status(400).json({
                ok: false, 
                msg: "User is already in event!"
            })
        }
        
        if(idEvent.capacity >= valEvent.attendees.length){
            return res.status(400).json({
                ok: false,
                msg: "Event at capacity, cannot add more"
            })
        }

        valEvent.attendees.push(idUser)
        await valEvent.save()

        return res.status(200).json({
            ok: true, 
            msg: "User Added!!"
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'server error. Contact Support'
        })
    }
}

module.exports = {
    createEvent,
    deleteEventById,
    getAllEvents,
    getEventById,
    updateEventById,
    capacityValidator
} 