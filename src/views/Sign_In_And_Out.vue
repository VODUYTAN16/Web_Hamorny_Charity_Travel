<template>
  <div
    class="container-fluid vh-100 d-flex align-items-center justify-content-center"
  >
    <div
      class="row shadow-lg rounded-3 overflow-hidden"
      style="width: 70%; max-width: 900px"
    >
      <!-- Left Section -->
      <div
        class="col-md-6 bg-primary text-white p-5 d-flex flex-column align-items-center justify-content-center"
      >
        <h1 class="fw-bold mb-4 text-center">
          Learn From World’s <br />
          Best Instructors 🌎 <br />
          Around The World.
        </h1>
        <img
          src="../assets/tree.png"
          alt="Study Online"
          class="img-fluid"
          style="max-height: 200px"
        />
      </div>

      <!-- Right Section -->
      <div class="col-md-6 bg-white p-5">
        <h3 class="fw-bold mb-4">
          {{ isLogin ? 'Sign In' : 'Create Account' }}
        </h3>
        <form @submit.prevent="handleSubmit">
          <!-- Full Name -->
          <div class="mb-3" v-if="!isLogin">
            <input
              v-model="FullName"
              type="text"
              class="form-control"
              placeholder="Full Name"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <input
              v-model="Email"
              type="email"
              class="form-control"
              placeholder="Email Address"
              required
            />
          </div>
          <div class="mb-3" v-if="!isLogin">
            <input
              v-model="PhoneNumber"
              type="text"
              class="form-control"
              placeholder="Phone Number"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-3 position-relative">
            <input
              v-model="Password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div class="mb-3" v-if="!isLogin">
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              placeholder="Confirm Password"
              required
            />
          </div>

          <!-- Terms & Conditions -->
          <div class="form-check mb-3" v-if="!isLogin">
            <input
              type="checkbox"
              class="form-check-input"
              id="terms"
              required
            />
            <label class="form-check-label" for="terms">
              I agree to the
              <a href="#" class="text-decoration-none">terms of service</a> and
              <a href="#" class="text-decoration-none">privacy policy</a>.
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 mb-3">
            {{ isLogin ? 'Sign In' : 'Sign Up' }}
          </button>

          <!-- Google Sign In -->
          <!-- <div>
            <div
              id="g_id_onload"
              :data-client_id="clientId"
              :data-callback="handleCredentialResponse"
              data-auto_prompt="true"
            >
              <div class="g_id_signin" data-type="standard"></div>
            </div>
          </div> -->
          <div id="buttonDiv"></div>

          <!-- Toggle Form -->
          <p class="text-center">
            {{
              isLogin ? "Don't have an account?" : 'Already have an account?'
            }}
            <a href="#" class="text-decoration-none" @click="toggleForm">
              {{ isLogin ? 'Sign Up' : 'Sign In' }}
            </a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

export default {
  data() {
    return {
      isLogin: true, // Toggle giữa Sign In và Sign Up
      Email: '',
      Password: '',
      FullName: '',
      PhoneNumber: '',
      confirmPassword: '',
      AvatarUrl:
        'https://i.pinimg.com/736x/f5/fd/14/f5fd146c41549072d5a7823e31ea8eae.jpg',
      clientId:
        '87667223869-08fsea38r378m40iqpfarbmdm6a7n9bl.apps.googleusercontent.com',
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin; // Chuyển đổi form
      this.clearForm();
    },
    clearForm() {
      this.Email = '';
      this.Password = '';
      this.FullName = '';
    },
    async handleSubmit() {
      try {
        if (!this.isLogin && this.Password !== this.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
        const endpoint = this.isLogin ? '/api/login' : '/api/register';
        const payload = {
          Email: this.Email,
          Password: this.Password,
          ...(this.isLogin ? {} : { FullName: this.FullName }),
          AvatarUrl: this.AvatarUrl,
          ...(this.isLogin ? {} : { PhoneNumber: this.PhoneNumber }),
        };
        console.log(payload);
        const response = await axios.post(endpoint, payload);
        if (response.status != 200) {
          alert('Sign in failed!');
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.$router.push('/');
          alert(response.data.message);
        }
      } catch (error) {
        alert('Error: ' + error.response.data.message);
      }
    },

    async handleCredentialResponse(response) {
      // console.log('Encoded JWT ID token: ' + response.credential);

      const data = this.parseJwt(response.credential);

      try {
        const response = await axios.post(
          '/api/google-login', // URL của API
          {
            FullName: data.name,
            Email: data.email,
            AvatarUrl: data.picture,
          },
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo header này
            },
          }
        );

        // Lưu trữ thông tin người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', response.data.token); // Lưu token nếu có (nếu bạn sử dụng JWT)

        this.$router.push('/');
        alert('Sign in successfull!');

        // Kiểm tra nếu có phản hồi chuyển hướng (giống như fetch)
        if (response.request.responseURL !== window.location.href) {
          // Nếu có chuyển hướng, điều hướng đến URL mới
          // window.location.href = response.request.responseURL;
        } else {
          // Nếu không có chuyển hướng, xử lý phản hồi bình thường
          console.log('No redirection occurred');
        }
      } catch (error) {
        console.error('Error during the request:', error);
      }
    },
    parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    },
  },
  mounted() {
    // Ensure the Google platform library is loaded before running
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse,
      });

      google.accounts.id.renderButton(document.getElementById('buttonDiv'), {
        theme: 'outline',
        size: 'large',
      });
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
}

.btn-outline-danger i {
  margin-right: 5px;
}

form {
  font-size: 0.9rem;
}

.btn-outline-secondary {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
