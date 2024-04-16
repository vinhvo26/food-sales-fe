<template>
  <div class="card-project flex w-full flex-wrap">
    <div
      class="card-project-image w-full"
      v-show="route.query.posts_type === '2' || !route.query.posts_type"
      :class="{
        block: item?.list_img.length === 1,
        flex: item?.list_img.length > 1,
      }"
    >
      <div
        v-if="item?.list_img.length"
        class="image-big w-6/12"
        :class="{ 'w-full': item?.list_img.length === 1 }"
      >
        <NuxtImg
          loading="lazy"
          v-show="item?.list_img[0]?.url"
          :src="item?.list_img[0]?.url"
          alt="image_detail"
        />
      </div>
      <div v-if="item?.list_img.length > 4" class="image-small w-6/12">
        <NuxtImg
          loading="lazy"
          v-for="index in 4"
          :key="index"
          v-show="item?.list_img[index]?.url"
          :src="item?.list_img[index]?.url"
          alt="image_detail"
        />
      </div>
      <div v-else-if="item?.list_img.length > 3" class="image-small w-6/12">
        <NuxtImg
          loading="lazy"
          v-show="item?.list_img[1]?.url"
          :src="item?.list_img[1]?.url"
          style="width: 98%"
          alt="image_detail"
        />
        <NuxtImg
          loading="lazy"
          v-show="item?.list_img[2]?.url"
          :src="item?.list_img[2]?.url"
          alt="image_detail"
        />
        <NuxtImg
          loading="lazy"
          v-show="item?.list_img[3]?.url"
          :src="item?.list_img[3]?.url"
          alt="image_detail"
        />
      </div>
      <div v-else-if="item?.list_img.length > 2" class="image-small w-6/12">
        <NuxtImg
          loading="lazy"
          class="image-two"
          v-show="item?.list_img[1]?.url"
          :src="item?.list_img[1]?.url"
          alt="image_detail"
        />
        <NuxtImg
          loading="lazy"
          class="image-two"
          v-show="item?.list_img[2]?.url"
          :src="item?.list_img[2]?.url"
          alt="image_detail"
        />
      </div>
      <div v-else-if="item?.list_img.length > 1" class="image-small w-6/12">
        <NuxtImg
          loading="lazy"
          class="image-one"
          v-show="item?.list_img[1]?.url"
          :src="item?.list_img[1]?.url"
          alt="image_detail"
        />
      </div>
    </div>
    <div
      class="card-project-infor w-full"
      :class="{ 'card-project-infor-buy': route.query.posts_type === '1' }"
    >
      <div class="flex mt-1 relative">
        <p class="card-name-project w-full line-clamp-2 w-full">
          {{ item?.title }}
        </p>
      </div>
      <div class="card-location flex">
        <div class="icon-project">
          <img src="@/core/assets/img/location-icon.png" alt="no_image" />
        </div>
        <div class="content-data">
          {{
            (locale === 'vi'
              ? [item?.street, item?.distric, item?.city, item?.country]
                  .filter(item => item)
                  .join(', ')
              : [item?.street, item?.distric, item?.city, item?.country]
                  .filter(item => item)
                  .map(item => JS_RemoveVietnameseTones(item))
                  .join(', ')) || $t('updating')
          }}
        </div>
      </div>
      <div class="flex w-full card-content">
        <div class="w-1/4 acreage-price">
          <div class="card-acreage flex" v-show="parseInt(item?.acreage)">
            <div class="icon-project">
              <img src="@/core/assets/img/area-icon.png" alt="no_image" />
            </div>
            <div class="content-data">
              <span class="acreage-number">
                {{
                  item.unit_area === 'hecta'
                    ? JS_addComma(
                        JS_ConvertHecta(item.acreage?.toString(), 'get_hecta')
                      )
                    : JS_addComma(item?.acreage)
                }}
              </span>
              <span v-if="item.unit_area === 'hecta'"> hecta </span>
              <span v-else> m<sup>2</sup></span>
            </div>
          </div>
          <div class="card-price flex">
            <div class="icon-project">
              <img src="@/core/assets/img/price-icon.png" alt="no_image" />
            </div>
            <div class="content-data">
              <span
                v-if="
                  (item?.isPrivatePrice === 1 && item?.price) ||
                  router.currentRoute.value.name === 'manage-sales-information'
                "
              >
                <span v-if="item?.currency_unit === 'USD'">
                  {{ JS_addComma(JS_numberRound(item?.price)) }} USD</span
                >
                <span v-else
                  >{{
                    JS_ConvertPrice(item?.price).num +
                    $t(JS_ConvertPrice(item?.price).txt)
                  }}
                  VND</span
                >
              </span>
              <span
                v-else-if="
                  (item?.isPrivatePrice === 0 && item?.price) ||
                  router.currentRoute.value.name === 'manage-sales-information'
                "
                class="text-red-500 font-bold text-2xl"
                >{{ $t('contact') }}</span
              >
            </div>
          </div>
        </div>
        <div class="w-3/4 phone-email">
          <div class="card-phone flex">
            <div class="icon-project">
              <img src="@/core/assets/img/phone-icon.png" alt="no_image" />
            </div>
            <div class="content-data">
              <span>0906.446.288 - 0949.663.201</span>
            </div>
          </div>
          <div class="card-membership flex">
            <div class="icon-project">
              <img src="@/core/assets/img/email-icon.png" alt="no_image" />
            </div>
            <div class="content-data">
              <span>ctyvanphuc.vn@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 content-cart">
        <p
          class="text-base text-infomation line-clamp-2 text-gray-500"
          v-html="item?.project_basic_information"
        ></p>
        <div v-show="isManageSales" class="mt-1.5">
          <UBadge
            class="h-9 p-4"
            variant="subtle"
            v-show="item?.isAvailable == POST.ACTIVE"
            >{{ $t('approved') }}</UBadge
          >
          <UBadge
            variant="subtle"
            class="h-9 p-4"
            v-show="item?.isAvailable == POST.PENDING"
            color="yellow"
            >{{ $t('waiting_for_approval') }}</UBadge
          >
          <UBadge
            class="h-9 p-4"
            variant="subtle"
            v-show="item?.isAvailable == POST.REJECT"
            color="red"
            >{{ $t('refuse') }}</UBadge
          >
        </div>
        <div v-show="!isManageSales && isAuth" class="flex justify-end mt-2">
          <UButton
            @click="handleCreateContact"
            class="w-max h-10 text-lg px-6 ml-1.5"
            block
            >{{ $t('consultation_contact') }}</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { POST } from '@/core/constants/index.js'
import {
  JS_ConvertPrice,
  JS_addComma,
  JS_numberRound,
  JS_RemoveVietnameseTones,
} from '@/core/utils/common'
import { useContactStore } from '../store/contact'
import { useAuthStore } from '../store/auth'
import { JS_ConvertHecta } from '@/core/utils/common'

const authStore = useAuthStore()
const useContact = useContactStore()
const useAuth = useAuthStore()
const toast = useToast()
const isAuth = computed(() => authStore.isAuth)
const { locale } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    default: {},
  },
  isManageSales: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()

const handleCreateContact = async event => {
  event.stopPropagation()
  const body = {
    posts_id: parseInt(props.item.posts_id),
    phone: useAuth.userInfoData.phone,
    name: [useAuth.userInfoData?.first_name, useAuth.userInfoData?.last_name]
      .filter(item => item)
      .join(' '),
    email: useAuth.userInfoData.email,
  }
  const { data } = await useContact.createContact(body)
  if (data.status) {
    toast.add({
      title: t('notification'),
      description: t('you_have_contacted_for_consultation_on_this_project'),
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
  } else {
    toast.add({
      title: 'Notification',
      description: data.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}
</script>
<style lang="scss" scoped>
.card-project:hover {
  box-shadow: 0px 0px 5px 5px #d7d7d7b3;
}
.card-project {
  box-shadow: 0px 0px 3px 2px #d7d7d7b3;
  padding: 20px;
  border-radius: 5px;
  margin: 30px 0px;
  cursor: pointer;
  .card-project-image {
    gap: 10px;
    padding-left: 6px;
    img {
      width: -webkit-fill-available;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
        rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
    }
    .image-big {
      img {
        width: 100%;
        height: 310px;
      }
    }
    .image-small {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      img {
        width: 48%;
        height: 150px;
      }
      .image-two {
        width: 100% !important;
      }
      .image-one {
        width: 100% !important;
        height: 310px !important;
      }
    }
  }
  .card-project-infor-buy {
    width: 100% !important;
  }
  .card-project-infor {
    padding-left: 10px;

    .content-data {
      padding-left: 10px;
      position: relative;
      top: -3px;
    }
    .card-location {
      margin-top: 10px;
      .content-data {
        width: 97%;
      }
    }
    .card-membership {
      margin-top: 5px;
    }
    .card-location,
    .card-membership {
      span {
        font-weight: 500;
        font-size: 18px;
        color: #072c2c;
        width: max-content;
      }
    }
    .card-acreage,
    .card-phone {
      margin-top: 5px;
      span {
        font-weight: 700;
        font-size: 18px;
        color: #072c2c;
      }
      .acreage-number {
        padding-right: 5px;
      }
      .unit {
        font-size: 14px;
      }
    }
    .content-cart {
      .text-infomation {
        font-size: 18px;
      }
    }
    .card-price {
      margin-top: 5px;
      span {
        font-weight: 700;
        font-size: 20px;
        color: #ff494f;
      }
      .unit {
        font-size: 14px;
      }
    }
    .card-name-project {
      font-weight: 600;
      font-size: 26px;
      color: #072c2c;
    }
    .see_more {
      color: #37cab8;
    }
    .icon-project {
      width: 20px;
      height: 20px;
      .icon-card {
        width: 24px;
        height: 24px;
        color: #37cab8;
        margin-right: 8px;
      }
    }
  }
}
@media only screen and (min-width: 990px) {
  .card-project-infor {
    .card-content {
      .acreage-price {
        width: 40% !important;
      }
      .phone-email {
        width: 60% !important;
      }
    }
  }
}
@media only screen and (min-width: 1142px) {
  .card-project-infor {
    .card-content {
      .acreage-price {
        width: 25% !important;
      }
      .phone-email {
        width: 75% !important;
      }
    }
  }
}
@media only screen and (max-width: 720px) {
  .list-project {
    .card-project-image,
    .card-project-infor {
      width: 100%;
    }
    .card-project-image {
      display: flex;
      justify-content: center;
      .image-big {
        width: 100% !important;
      }
      .image-small {
        display: none !important;
      }
    }
    .card-project-infor {
      padding-left: 0px;
      .card-name-project {
        width: 100% !important;
      }
      .card-content {
        display: block !important;
        .acreage-price,
        .phone-email {
          width: 100% !important;
        }
      }
    }
  }
}
@media only screen and (max-width: 450px) {
  .card-project-image {
    .image-big {
      img {
        height: 200px !important;
      }
    }
  }
  .card-project-infor {
    .card-name-project {
      font-size: 20px !important;
    }
    .card-location,
    .acreage-price,
    .phone-email {
      .icon-project {
        width: 16px !important;
        height: 16px !important;
      }
      .content-data {
        span {
          font-size: 16px !important;
        }
      }
    }
    .content-cart {
      .text-infomation {
        font-size: 16px !important;
      }
    }
  }
}
</style>
