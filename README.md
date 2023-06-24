# Music-API
Projeto para a disciplina programação  Web Back-End

# Sobre
Foi desenvolvida uma aplicação para controle de uma API musical, nela é possível, listar, cadastrar, editar e excluir itens das tabelas: "Music", "Album", "Artist" e "User".

# Lógica de négocio
Foi acrescentada uma função para que seja possível a listagem de recomendação de álbuns através do gênero ou década.
 Apenas usuários logados e autenticados conseguem obter essas recomendações.

 # Informações Adicionais
Usuários: 
- A criação de usuário comum é feita através de uma rota sem proteção, para que todos que estejam acessando pela primeira vez consigam criar uma conta.
- Um usuário comum só tem permissão de editar a si mesmo.
- - A listagem de usuários só é possível através de autenticação;
- Um administrador pode editar usuários comuns e outros administradores.
- Apenas um administrador pode criar outro administrador.
- Um administrador pode excluir um usuário comum, entretanto, não tem permissão para deletar um administrador.

Demais Tabelas:
- A listagem de álbuns, artistas e músicas é permitida até mesmo para quem não está autenticado.
- A criação, edição e exclusão de álbuns, artistas e músicas só é permitida para usuários autenticados e que sejam administradores.

