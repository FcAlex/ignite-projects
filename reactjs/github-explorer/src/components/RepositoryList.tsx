import { RepositoryItem } from "./RepositoryItem";

import '../styles/repositories.scss'
import { useEffect, useState } from "react";

type Repository = {
  name: string,
  description: string,
  html_url: string, 
  node_id: string
}

export function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/orgs/rocketseat/repos')
      .then(response => response.json())
      .then(data => setRepositories(data))
  }, []); // componentDidMount

  function createRepositoryItems(repository: Repository) {
    const repositoryProps = {
      name: repository.name,
      description: repository.description,
      link: repository.html_url
    }

    return <RepositoryItem key={repository.node_id} repository={repositoryProps} />
  }

  return (
    <section className="repository-list">
      <h1>Lista de Repositórios</h1>

      <ul>
        {repositories && repositories.map(createRepositoryItems)}
      </ul>
    </section>
  )
}