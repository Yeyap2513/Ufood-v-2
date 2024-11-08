<template>
    <div class="d-flex justify-content-center align-items-center col-12 mt-5">
        <LoginForm @userSelected="handleUserSelected"/>
    </div>
</template>

<script lang="ts">
import LoginForm from '@/components/authentification/LoginForm.vue';
import { loginUser, userCollections } from '@/store/store';
import { defineComponent } from 'vue';

export default defineComponent({
    components:{
        LoginForm,
    },
    data(){
        return{
           user_email: "",
           
        }
    },
    methods: {
    async handleUserSelected(userMail: string) {
            this.user_email = userMail;
            this.getCurrentUser();
            this.$router.push("/");
        },
    async getCurrentUser() {
        try {
            await loginUser(this.user_email);
            window.location.reload();
            console.log(userCollections);
        } catch (error) {
            console.error("Erreur lors de la récupération de la météo :", error);
        }
    },
  },
})

</script>