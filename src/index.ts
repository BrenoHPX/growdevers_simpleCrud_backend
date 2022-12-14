import { v4 as uuidv, v4 } from 'uuid'
import express, { Express, Request, Response } from 'express'

const server: Express = express()

server.use(express.json())

server.listen(3000, () => {
	console.log('server running')
})

interface IGrowdever {
	id: string
	nome: string
	skills?: string[]
}

interface RespostaPadrao {
	sucesso: boolean
	mensagem: string
	data: any
}

const growdevers: IGrowdever[] = []

server.get('/growdevers', (req: Request, res: Response) => {
	const { filtro } = req.query

	if (filtro) {
		return res.json({
			sucesso: true,
			mensagem: 'get por filtro',
			data: growdevers.filter((f) =>
				f.nome.toLowerCase().includes(filtro.toString().toLowerCase())
			)
		} as RespostaPadrao)
	}

	res.json({
		sucesso: true,
		mensagem: 'Lista completa',
		data: growdevers
	} as RespostaPadrao)
})

server.post('/growdever', (req: Request, res: Response) => {
	const { nome, skills } = req.body

	if (!nome) {
		return res.status(400).json({
			sucesso: false,
			mensagem: 'Nome não informado',
			data: null
		} as RespostaPadrao)
	}

	const id = v4()

	const newGrowdever = {
		id: v4(),
		nome,
		skills
	} as IGrowdever

	growdevers.push(newGrowdever)

	return res.status(201).json({
		sucesso: true,
		mensagem: 'Conta criada',
		data: newGrowdever
	} as RespostaPadrao)
})

server.put('/growdever/:id', (req: Request, res: Response) => {
	const { id } = req.params
	const { skills } = req.body

	const growdeverAlvo = growdevers.find((f) => f.id === id)

	if (!growdeverAlvo) {
		return res.status(400).json({
			sucesso: false,
			mensagem: 'Growdever não encontrado'
		} as RespostaPadrao)
	}

	if (!skills) {
		return res.status(400).json({
			sucesso: false,
			mensagem: 'Skill não informada'
		} as RespostaPadrao)
	}

	growdeverAlvo.skills = [...(growdeverAlvo.skills ?? []), ...skills]
	res.status(200).json({
		sucesso: true,
		data: growdeverAlvo
	} as RespostaPadrao)
})

server.delete('/growdever/:id', (req: Request, res: Response) => {
	const { id } = req.params
	const growdeverIndex = growdevers.findIndex((f) => f.id === id)

	if (growdeverIndex === -1) {
		return res.status(404).json({
			sucesso: false,
			mensagem: 'Growdever não encontrado'
		} as RespostaPadrao)
	}

	growdevers.splice(growdeverIndex, 1)
	res.status(200).json({
		sucesso: true,
		mensagem: 'Growdever apagado!'
	} as RespostaPadrao)
})
