<template>
    <div>
        <h4>Acesso ao Login</h4>
        <form>
            <label for="email">Endereço de E-mail</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>

            <div>
                <label for="password">Senha</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <button type="submit" @click="handleSubmit">Login</button>
            </div>
        </form>
    </div>    
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                if (this.password.lenght > 0) {
                    this.$http.post('http://localhost:3000/login', {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {

                    })
                    .catch ((error) => {
                        console.error(error.response);
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>

