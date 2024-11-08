<template>
    <div class="auth-form">
      <h2>{{ mode === 'signup' ? 'Create an account' : 'Sign in' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-if="mode === 'signup'" class="form-group">
          <input type="text" v-model="firstName" placeholder="First name" required />
          <input type="text" v-model="lastName" placeholder="Last name" required />
        </div>
        <div class="form-group">
          <input type="text" v-model="query" placeholder="Email" required @input="filterEmail" name="email"/>
        </div>
        <div v-if="mode === 'signup'" class="form-group">
          <div class="form-group">
            <input type="password" v-model="password" placeholder="Password" required />
          </div>
          <input type="checkbox" v-model="termsAccepted" /> I agree to the <a href="#">Terms & Conditions</a>
        </div>
        <button type="submit">{{ mode === 'signup' ? 'Create account' : 'Sign in' }}</button>
      </form>
      <ul class="list-group mt-2" v-if="filteredEmail.length" style="z-index: 1000;">
        <li 
          class="list-group-item" 
          v-for="(email, index) in filteredEmail" 
          :key="index" 
          @click="setUser(email.email)"
          style="cursor: pointer;"
        >
          {{ email.email }}
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
import { UserPoco } from '@/pocos/UserPoco';
import { users } from '@/store/store';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "LoginForm",
    props: {
        mode: {
            type: String,
            default: 'signin',
        },
        env: {
            type: String,
            default: 'dev',
        }
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            password: '',
            termsAccepted: false,
            query: '',
            filteredEmail: [] as UserPoco[],  // Typage plus précis pour filteredEmail
        }
    },
    methods: {
        handleSubmit() {
            // Appelle selectUser si env est 'dev', sinon appelle submitForm
            if (this.env === 'dev') {
                this.selectUser();
            } else {
                this.submitForm();
            }
        },
        filterEmail() {
            this.filteredEmail = users.filter((user: UserPoco) => {
                return this.query && user.email.toLowerCase().includes(this.query.toLowerCase());
            });
        },
        setUser(userEmail: string) {
            this.query = userEmail;
            this.filteredEmail = [];
        },
        selectUser() {
            this.$emit('userSelected', this.query);
        },
        submitForm() {
            if (this.mode === 'signup' && !this.termsAccepted) {
                alert("Vous devez accepter les termes et conditions pour vous inscrire.");
                return;
            }
            this.$emit(this.mode === 'signup' ? 'userSignup' : 'userSignin', {
                email: this.query,
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password
            });
        }
    },
    emits: [
        'userSignup',
        'userSignin',
        'userSelected',
    ]
});
</script>


<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  background-color: #000000;
  padding: 5rem;
  border-radius: 8px;
  max-width: 400px;
  color: #ffffff;
}

.auth-form h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffffff;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  background-color: #d7af7a;
  border: 1px solid #737355;
  border-radius: 5px;
  color: #ffd796;
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: #ffd796;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

button[type="submit"] {
  width: 100%;
  padding: 0.8rem;
  background-color: #E2850B;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #8e5205;
}
</style>
