import dayjs from 'dayjs';
import { UpdateIcon } from '@/components/icons/update-icon';
import { CreditCardIcon } from '@/components/icons/credit-card-icon';
import { CalenderIcon } from '@/components/icons/calendar-icon';
import { LayoutIcon } from '@/components/icons/layout-icon';
import { LabelIcon } from '@/components/icons/label-icon';
import { ProductIcon } from '@/components/icons/product-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import classNames from 'classnames';
import { Category, Tag } from '@/types';
import routes from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { getIcon } from '@/lib/get-icon';
import * as TypeIcons from '@/components/icons/type/index';
import usePrice from '@/lib/hooks/use-price';

interface Props {
  className?: string;
  updated_at: string;
  created_at: string;
  price?: number;
  categories?: Category[];
  trial?: string | null;
  tags: Tag[];
  layoutType: string;
  icon?: any;
}

export default function ProductInformation({
  className,
  updated_at,
  created_at,
  price,
  categories,
  trial,
  tags,
  layoutType,
  icon,
}: Props) {
  const { t } = useTranslation('common');
  const { price: formatedPrice, basePrice } = usePrice({
    amount: price ? price : 0,
    baseAmount: price,
  });
  return (
    <div className={classNames('space-y-4 text-13px', className)}>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            {/* <UpdateIcon className="h-[18px] w-[18px]" /> */}
            <CreditCardIcon className="h-[18px] w-[18px]" />
          </span>
          {t('text-pricing') /*t('text-last-update')*/}:
        </strong>
        <span className="font-medium">
          {t('text-starts-at')}{' '}
          {formatedPrice /*dayjs(updated_at).format('MMM D, YYYY')*/}
        </span>
      </div>
      {trial && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <CalenderIcon className="h-[18px] w-[18px]" />
            </span>
            {t('text-trial') /*t('text-published')*/}:
          </strong>
          <span className="font-medium">
            {trial /*dayjs(created_at).format('MMM D, YYYY')*/}
          </span>
        </div>
      )}
      {/*<div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            {getIcon({
              iconList: TypeIcons,
              iconName: icon!,
              className: 'h-[18px] w-[18px]',
            })}
          </span>
          {t('text-layout')}:
        </strong>
        <span className="font-medium">{layoutType}</span>
      </div>*/}
      {!!categories?.length && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <ProductIcon className="h-5 w-5" />
            </span>
            {t('text-categories')}:
          </strong>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: Category) => (
              <AnchorLink
                key={category.id}
                href={routes.categoryUrl(category.slug)}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {category.name}
              </AnchorLink>
            ))}
          </div>
        </div>
      )}
      {!!tags?.length && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <LabelIcon className="h-5 w-5" />
            </span>
            {t('text-tags')}:
          </strong>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: Tag) => (
              <AnchorLink
                key={tag.id}
                href={routes.tagUrl(tag.slug)}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {tag.name}
              </AnchorLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
