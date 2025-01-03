<template>
    <div class="subscription-component text-center">
      <!-- Tiêu đề -->
      <h3 class="mb-4">We also travel to inboxes</h3>
  
      <!-- Form -->
      <form class="d-flex justify-content-center align-items-center gap-2">
        <input
          type="email"
          class="form-control w-50"
          placeholder="Your email..."
          required
        />
        <button type="submit" class="btn btn-dark px-4">
          Subscribe
        </button>
      </form>
  
      <!-- Chú thích -->
      <p class="text-muted mt-3 small " style="max-width: 600px; margin:auto;">
        By entering your email, you agree to receive offers and trip updates via
        email and text message from Way To Travel, and you understand that consent
        to receive marketing messages is not a condition of purchase. You can
        unsubscribe at any time.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: "SubscriptionComponent",
  };
  </script>
  
  <style scoped>
  .subscription-component {
    /* background: linear-gradient(to bottom, #8bc0e3, #133E87); */
    /* background: linear-gradient(to bottom, #DFF5FA, #6CAED0); */
    background: linear-gradient(180deg, #B3D5ED, #8CBFDC);

    padding: 40px 20px;
  }
  </style>
  