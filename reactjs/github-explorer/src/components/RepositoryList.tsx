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
  const [username, setUsername] = useState("");
  const [isOrg, setIsOrg] = useState(false);

  // useEffect(() => {
  //   fetch('https://api.github.com/orgs/rocketseat/repos')
  //     .then(response => response.json())
  //     .then(data => setRepositories(data))
  // }, []);

  function createRepositoryItems(repository: Repository) {
    const repositoryProps = {
      name: repository.name,
      description: repository.description,
      link: repository.html_url
    }

    return <RepositoryItem key={repository.node_id} repository={repositoryProps} />
  }

  function getRepositories() {
    fetch(`https://api.github.com/${isOrg ? 'orgs' : 'users'}/${username}/repos`)
      .then(response => {
        if(!response.ok) 
          throw new Error();
        
        return response.json()
      })
      .then(data => setRepositories(data))
      .catch(_ => setRepositories([]))
  }

  return (
    <section className="repository-list">      
      <h1>Lista de Repositórios</h1>

      <form onSubmit={e => e.preventDefault()}>
        <div className="is-org">
          <input 
            type="checkbox" 
            id="isOrg"
            checked={isOrg}
            onChange={e => setIsOrg(e.target.checked)}/> 
          <label htmlFor="isOrg"> É uma organização?</label>
        </div>  

        <div className="search">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <button type="button" onClick={getRepositories}>Buscar</button>
        </div>
      </form>

      <ul>
        {repositories && repositories.map(createRepositoryItems)}
      </ul>
    </section>
  )
}