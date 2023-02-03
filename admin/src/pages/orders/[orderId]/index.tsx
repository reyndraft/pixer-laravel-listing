import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import Loader from '@/components/ui/loader/loader';
import ValidationError from '@/components/ui/form-validation-error';
import { Attachment, OrderStatus, PaymentStatus } from '@/types';
import { useDownloadInvoiceMutation, useOrderQuery, useUpdateOrderMutation } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@/components/ui/select-input';
import { useIsRTL } from '@/utils/locals';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { ORDER_STATUS } from '@/utils/order-status';
import OrderViewHeader from '@/components/order/order-view-header';
import OrderStatusProgressBox from '@/components/order/order-status-progress-box';

type FormValues = {
	order_status: any;
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);

	useEffect(() => {
		resetCart();
		resetCheckout();
	}, [resetCart, resetCheckout]);

  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const {
    order,
    isLoading: loading,
    error,
  } = useOrderQuery({ id: query.orderId as string, language: locale! });
  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );

	const {
		handleSubmit,
		control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: order?.order_status ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      id: order?.id as string,
      order_status: order_status?.status as string,
    });
  };
  const { price: subtotal } = usePrice(
    order && {
      amount: order?.amount!,
    }
  );

  const { price: total } = usePrice(
    order && {
      amount: order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    order && {
      amount: order?.discount! ?? 0,
    }
  );
  const { price: delivery_fee } = usePrice(
    order && {
      amount: order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    order && {
      amount: order?.sales_tax!,
    }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleDownloadInvoice() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'order-invoice');
      a.click();
    }
  }

  const columns = [
    {
      dataIndex: 'image',
      key: 'image',
      width: 70,
      render: (image: Attachment) => (
        <Image
          src={image?.thumbnail ?? siteSettings.product.placeholder}
          alt="alt text"
          layout="fixed"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: string, item: any) => (
        <div>
          <span>{name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: function Render(_: any, item: any) {
        const { price } = usePrice({
          amount: parseFloat(item.pivot.subtotal),
        });
        return <span>{price}</span>;
      },
    },
  ];

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <OrderViewHeader order={order} wrapperClassName="px-8 py-4" />
        </div>
        <div className="flex w-full">
          <Button
            onClick={handleDownloadInvoice}
            className="mb-5 bg-blue-500 ltr:ml-auto rtl:mr-auto"
          >
            <DownloadIcon className="w-4 h-4 me-3" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>
        </div>

        <div className="flex flex-col items-center lg:flex-row">
          <h3 className="w-full mb-8 text-2xl font-semibold text-center whitespace-nowrap text-heading lg:mb-0 lg:w-1/3 lg:text-start">
            {t('form:input-label-order-id')} - {order?.tracking_number}
          </h3>

          {order?.order_status !== OrderStatus.FAILED &&
            order?.order_status !== OrderStatus.CANCELLED && (
              <form
                onSubmit={handleSubmit(ChangeStatus)}
                className="flex items-start w-full ms-auto lg:w-2/4"
              >
                <div className="z-20 w-full me-5">
                  <SelectInput
                    name="order_status"
                    control={control}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.status}
                    options={ORDER_STATUS.slice(0, 6)}
                    placeholder={t('form:input-placeholder-order-status')}
                  />

                  <ValidationError message={t(errors?.order_status?.message)} />
                </div>
                <Button loading={updating}>
                  <span className="hidden sm:block">
                    {t('form:button-label-change-status')}
                  </span>
                  <span className="block sm:hidden">
                    {t('form:form:button-label-change')}
                  </span>
                </Button>
              </form>
            )}
        </div>

        <div className="flex items-center justify-center my-5 lg:my-10">
          <OrderStatusProgressBox
            orderStatus={order?.order_status as OrderStatus}
            paymentStatus={order?.payment_status as PaymentStatus}
          />
        </div>

        <div className="mb-10">
          {order ? (
            <Table
              //@ts-ignore
              columns={columns}
              emptyText={t('table:empty-table-data')}
              data={order?.products!}
              rowKey="id"
              scroll={{ x: 300 }}
            />
          ) : (
            <span>{t('common:no-order-found')}</span>
          )}

          <div className="flex flex-col w-full px-4 py-4 space-y-2 border-t-4 border-double border-border-200 ms-auto sm:w-1/2 md:w-1/3">
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-sub-total')}</span>
              <span>{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-tax')}</span>
              <span>{sales_tax}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-delivery-fee')}</span>
              <span>{delivery_fee}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-discount')}</span>
              <span>{discount}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-heading">
              <span>{t('common:order-total')}</span>
              <span>{total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="w-full mb-10 sm:mb-0 sm:w-1/2 sm:pe-8">
            <h3 className="pb-2 mb-3 font-semibold border-b border-border-200 text-heading">
              {t('common:billing-address')}
            </h3>

            <div className="flex flex-col items-start space-y-1 text-sm text-body">
              <span>{order?.customer_name}</span>
              {order?.billing_address && (
                <span>{formatAddress(order.billing_address)}</span>
              )}
              {order?.customer_contact && (
                <span>{order?.customer_contact}</span>
              )}
            </div>
          </div>

          <div className="w-full sm:w-1/2 sm:ps-8">
            <h3 className="pb-2 mb-3 font-semibold border-b border-border-200 text-heading text-start sm:text-end">
              {t('common:shipping-address')}
            </h3>

            <div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:items-end sm:text-end">
              <span>{order?.customer_name}</span>
              {order?.shipping_address && (
                <span>{formatAddress(order.shipping_address)}</span>
              )}
              {order?.customer_contact && (
                <span>{order?.customer_contact}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
