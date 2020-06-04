import api from './api';

class App {
    constructor() {
       this.respositores = [];

       this.listaEl = document.getElementById('carregando');
       this.formEl = document.getElementById('repo-form');
       this.inputEl = document.querySelector('input[name=repository]');

       this.formUserEl = document.getElementById('userlist-form');
       this.inputUserEl = document.querySelector('input[name=userlist]');

       this.listEl = document.getElementById('repo-list');

       this.registerReposHandlers();
       this.registerUsersHandlers();
       

    }

        registerReposHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

        registerUsersHandlers() {
        this.formUserEl.onsubmit = event => this.listUsers(event);
    }


    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando...'));
            loadingEl.setAttribute('id', 'loading');

            this.listaEl.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }
    };


    async listUsers(event) {
        event.preventDefault();

        const repoInput = this.inputUserEl.value;

        if(repoInput.length === 0)
        return;

        this.setLoading();

        try {

        const response = await api.get(`/users/${repoInput}/repos?per_page=200`);
        
        const repositoriesData = response.data;
        const [ { name, description, html_url, owner: {avatar_url} } ] = repositoriesData;

        this.respositores = []; //limpa o array antes do push

        for (const data of repositoriesData) { 

        this.respositores.push({
            name: data.name,
            description: data.description,
            avatar_url: data.owner.avatar_url,
            html_url: data.html_url,
        });

        };

        //console.log(this.respositores);
        this.render();


        this.inputUserEl.value = '';
        
        } catch (err) {
            console.warn('O Usuário não existe');
            alert('O Usuário não existe');
        }

        this.setLoading(false);
    }    


    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput.length === 0)
        return;

        this.setLoading();

        try {
        const response = await api.get(`/repos/${repoInput}`);
        //const response = await api.get(`/users/${repoInput}/repos`);
        //console.log(response.data);
        const { name, description, html_url, owner: {avatar_url} } = response.data;
        this.respositores.push({
            name: name,
            description,
            avatar_url,
            html_url,
        });

        //console.log(this.respositores);
        this.render();
        this.inputEl.value = '';
        } catch (err) {
            console.warn('O Repositório não existe');
            alert('O repositório não existe');
        }

        this.setLoading(false);
    }

    render() {
        this.listEl.innerHTML = '';

        this.respositores.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            this.listEl.appendChild(listItemEl);
        });

    }

}

new App();