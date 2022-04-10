
type Repository = {
  name: string,
  description: string,
  link: string
}

interface RepositoryItemProps {
  repository: Repository
}

export function RepositoryItem(props: RepositoryItemProps) {
  return (
    <li>
      <strong>{props.repository.name}</strong>
      <p>{props.repository.description}</p>

      <a href={props.repository.link} target="_blank">Acessar Repositório</a>
    </li>
  )
}