<template>
  <div>
    <header>
      <Navigate></Navigate>
      <div class="heroimage">
        <HeroSection
          image="https://media.istockphoto.com/id/1512839621/vi/anh/h%C3%ACnh-%E1%BA%A3nh-ph%E1%BA%A3n-chi%E1%BA%BFu-b%C3%ACnh-minh-tr%C3%AAn-c%E1%BA%A7u-r%E1%BB%93ng-th%C3%A0nh-ph%E1%BB%91-%C4%91%C3%A0-n%E1%BA%B5ng.jpg?s=2048x2048&w=is&k=20&c=fnnKucMMkWmX7JEBp4yOIh-5qkjX6dtGqWXtW2I6zVc="
          p2="OUR tours"
        ></HeroSection>
      </div>
    </header>
    <div>
      <ul
        class="nav nav-tabs justify-content-center fs-4"
        id="myTab"
        role="tablist"
        style="background-color: rgba(31, 68, 95)"
      >
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active fw-bold"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            Our Tours
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link fw-bold"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
          >
            Your Booking History
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active tour-history"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabindex="0"
        >
          <h3>List Of Tour</h3>
          <TourSection></TourSection>
        </div>
        <div
          class="tab-pane fade tour-history"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabindex="0"
        >
          <h3>Booking History</h3>
          <div class="container my-4">
            <div v-if="bookings.length === 0" class="alert alert-info">
              You have no tour booking history.
            </div>

            <div class="list-group">
              <div
                v-for="(item, index) in filter(Filter)"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 class="mb-1">{{ item.tourname }}</h5>
                  <p class="mb-1 text-muted">
                    Booking Date: {{ formatDate(item.bookingdate) }}
                  </p>
                  <span :class="getStatusClass(item.status)">
                    {{ item.status }}
                  </span>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-success"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  @click="
                    getDetailOfSpecificedBooking(item),
                      bookedServices(item.bookingid)
                  "
                >
                  Detail
                </button>
              </div>
            </div>

            <!-- Modal -->
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1
                      class="modal-title fs-5 text-primary"
                      id="exampleModalLabel"
                    >
                      DETAIL OF BOOKING
                    </h1>

                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col">
                        <h5 class="text-success">Info Of Tour</h5>
                        <h6>Name of tour: {{ BookingDetail[0].tourname }}</h6>
                        <h6>Price of tour: ${{ BookingDetail[0].price }}</h6>

                        <h6>
                          Start Date:
                          {{
                            new Date(
                              BookingDetail[0].startdate
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          }}
                        </h6>
                        <h6>
                          End Date:
                          {{
                            new Date(
                              new Date(BookingDetail[0].startdate).setDate(
                                new Date(BookingDetail[0].startdate).getDate() +
                                  BookingDetail[0].duration -
                                  1
                              )
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          }}
                        </h6>
                      </div>
                      <div class="col">
                        <h5 class="text-success">Whose Booking</h5>
                        <h6>FullName: {{ BookingDetail[0].fullname }}</h6>
                        <h6>
                          Phone Number: {{ BookingDetail[0].phonenumber }}
                        </h6>
                        <h6>
                          Booking Date:
                          {{
                            new Date(
                              BookingDetail[0].bookingdate
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })
                          }}
                        </h6>
                        <h6>
                          Number of participant:
                          {{ BookingDetail[0].numberofguests }}
                        </h6>
                        <h6>
                          <span class="fst-italic text-nowrap">
                            Services Price Total:
                          </span>
                          ${{ ServicePriceTotal(bookServices) }}
                        </h6>
                        <h6>
                          <span class="fst-italic text-nowrap"
                            >Trip Price:</span
                          >
                          ${{ BookingDetail[0].price }} *
                          {{ BookingDetail[0].numberofguests }} = ${{
                            BookingDetail[0].price *
                            BookingDetail[0].numberofguests
                          }}
                        </h6>
                        <h6>
                          <span class="fst-italic text-nowrap"
                            >Total Amount:</span
                          >
                          ${{ BookingDetail[0].totalamount }}
                        </h6>
                      </div>
                      <div class="col">
                        <h5 class="text-success">Booked Services</h5>

                        <table
                          class="table table-striped table-bordered table-hover table-sm"
                        >
                          <thead class="table-light">
                            <tr>
                              <th class="fw-bold">#</th>
                              <th class="fw-bold">Service</th>
                              <th class="fw-bold">Price</th>
                              <th class="fw-bold">Quantity</th>
                              <th class="fw-bold">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(service, index) in bookServices"
                              :key="index"
                            >
                              <td>{{ index + 1 }}</td>
                              <td>{{ service.servicename }}</td>
                              <td>${{ service.price }}</td>
                              <td>{{ service.quantity }}</td>
                              <td>${{ service.quantity * service.price }}</td>
                            </tr>
                            <tr
                              v-if="bookServices && bookServices.length === 0"
                            >
                              <td colspan="7" class="text-center">Nothing</td>
                            </tr>
                          </tbody>
                        </table>
                        <h6></h6>
                      </div>
                    </div>

                    <table
                      class="table table-striped table-bordered table-hover table-sm"
                    >
                      <thead class="table-light">
                        <tr>
                          <th class="fw-bold">#</th>
                          <th class="fw-bold">FullName</th>
                          <th class="fw-bold">Date of Birth</th>
                          <th class="fw-bold">Gender</th>
                          <th class="fw-bold">Email</th>
                          <th class="fw-bold">Phone Number</th>
                          <th class="fw-bold">Full Name on passport</th>
                          <th class="fw-bold">Passport number</th>
                          <th class="fw-bold">Nationality</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in BookingDetail" :key="index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.fullname }}</td>
                          <td>
                            {{
                              new Date(item.dateofbirth).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )
                            }}
                          </td>
                          <td>{{ item.gender }}</td>
                          <td>{{ item.email }}</td>
                          <td>{{ item.phonenumber }}</td>
                          <td>{{ item.fullnameonpassport }}</td>
                          <td>{{ item.passportnumber }}</td>
                          <td>{{ item.nationality }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '@/axios';
import Navigate from './Navigate.vue';
import HeroSection from './HeroSection.vue';
import TourSection from '@/components/TourSection.vue';
import Footer from './Footer.vue';

const getStatusClass = (status) => {
  const statusClassMap = {
    spending: 'badge bg-light',
    booked: 'badge bg-success',
    cancelled: 'badge bg-danger',
    paid: 'badge bg-primary',
  };
  return statusClassMap[status] || 'badge bg-secondary';
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const Filter = reactive({
  startdate: '',
  enddate: '',
  tourid: '',
  status: '',
  tourname: '', // Thêm trường mới
  bookingid: '',
});

const currentStep = ref(1);
const BookingDetail = ref([{}]);
const bookServices = ref([{}]);

var bookings = ref([]); // Save current bookings
const tourNameList = ref([]); // Save current tour name list

const removeDiacritics = (str) => {
  return str
    .normalize('NFD') // Chuyển thành dạng Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .toLowerCase(); // Chuyển về chữ thường
};

const filter = (Filter) => {
  console.log(Filter);
  const query = removeDiacritics(Filter.tourname || '').trim();

  const filteredBookings = bookings.value.filter((booking) => {
    const tourName = removeDiacritics(booking.tourname).trim();
    const queryWords = query.split(/\s+/); // Tách từ theo khoảng trắng
    const tourWords = tourName.split(/\s+/);

    // ✅ Kiểm tra nếu mọi từ trong query đều xuất hiện trong bất kỳ từ nào của tên tour
    const matchEachWord = queryWords.every((q) =>
      tourWords.some((word) => word.includes(q))
    );

    return (
      (!Filter.tourid ||
        Filter.tourid == -1 ||
        booking.tourid == Filter.tourid) &&
      (!Filter.status ||
        Filter.status === 'All' ||
        booking.status === Filter.status) &&
      (!Filter.startdate ||
        new Date(booking.startdate) >= new Date(Filter.startdate)) &&
      (!Filter.enddate ||
        new Date(booking.enddate) <= new Date(Filter.enddate)) &&
      (!Filter.tourname || matchEachWord) // Chỉ lọc theo tên nếu có tourname
    );
  });
  console.log('filteredBookings: ', filteredBookings);
  return filteredBookings;
};

const fetchUser = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData) {
    fetchBookings(userData.userid);
  }
};

const fetchBookings = async (userid) => {
  try {
    const response = await api.get(`/api/booking/${userid}`);
    bookings.value = response.data.reverse();
    console.log(userid);
    console.log('bookings: ', bookings.value);
    bookings.value.map((item) => {
      item.startdate = new Date(item.startdate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      item.enddate = new Date(item.enddate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
    tourNameList.value = [
      ...new Map(
        bookings.value.map((booking) => [
          booking.tourid,
          { tourid: booking.tourid, tourname: booking.tourname },
        ])
      ).values(),
    ];
  } catch (error) {
    console.log(error);
  }
};

const getDetailOfSpecificedBooking = async (booking) => {
  try {
    const response = await api.get(`/api/detail_booking/${booking.bookingid}`);
    BookingDetail.value = response.data;
  } catch (err) {
    console.log('err of getDetailOfSpecificedBooking', err);
  }
};

const bookedServices = async (bookingid) => {
  try {
    const response = await api.get(`/api/booked_service/${bookingid}`);
    bookServices.value = response.data;
    console.log(bookServices.value);
  } catch (error) {
    console.log('Error bookedServices', error);
  }
};

const ServicePriceTotal = (bookServices) => {
  return bookServices.reduce((acc, service) => {
    return acc + service.price * service.quantity;
  }, 0);
};

onMounted(() => {
  fetchUser();
});
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.heroimage {
  height: 450px;
  overflow: hidden;
}

header .content {
  background-color: rgba(31, 68, 95);
  font-size: 1.5rem;
  color: #fff;
  padding: 20px;
}

.nav-tabs .nav-link {
  color: white; /* Màu chữ mặc định khi không active */
}

.nav-tabs .nav-link.active {
  color: rgba(31, 68, 95) !important; /* Màu chữ xanh khi active */
}

.tour-history {
  margin: 20px;
  padding: 10px;
}
</style>
