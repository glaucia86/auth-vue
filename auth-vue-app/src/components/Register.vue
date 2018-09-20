<template>
    <div>
        <h4>Registrar</h4>
        <form>
            <label for="name">Nome:</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email">Endereço de E-mail:</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="password">Senha:</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>

            <label for="password-confirm">Confirma a Senha:</label>
            <div>
                <input id="password-confirm" type="password" v-model="password-confirmation" required>
            </div>

            <label for="password-confirm">Você é administrador da Conta?</label>
            <div>
                <select v-model="is_admin">
                    <option value="1">Sim</option>
                    <option value="0">Não</option>
                </select>
            </div>

            <div>
                <button type="submit" @click="handleSubmit">Registrar</button>
            </div>
        </form>
    </div>
</template>

<script>
    
</script>

<style scoped>

</style>

