import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OrdersModal from './OrdersModal';
import { Order, orderState } from '../../../services/orders/types';
import { orderService } from '../../../services/orders/orderService';

function generateMockOrder(status: orderState): Order {
  const mockOrder: Order = {
    order_id: 1,
    sender_user: {
      id: 1,
      username: 'ryota1',
      email: 'ryota1@gmail.com',
    },
    receiver_user: {
      id: 2,
      username: 'ryota2',
      email: 'ryota2@gmail.com',
    },
    order_items: [],
    status,
    delivery_address: 'Mountain View',
    status_history: [],
  };

  return mockOrder;
}

describe('OrdersModal component tests', () => {
  describe('Save button', () => {
    it('Is disabled when no option is selected by the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is disabled for the buyer when the status is ordered', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'buyer'}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled when the seller changes the status from ordered to sent', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
        />,
      );

      const radio = (await screen.findByLabelText('Sent')) as HTMLInputElement;
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is disabled for the buyer when the status is sent, but the user has not selected an option', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled for the buyer when the status is sent and the user has selected an option', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
        />,
      );

      const radio = (await screen.findByLabelText('Received')) as HTMLInputElement;
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is enabled if the seller chooses a different option and disabled when they revert back to sent', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'seller'}
        />,
      );

      const sentRadio = (await screen.findByLabelText('Sent')) as HTMLInputElement;
      const rejectedRadio = (await screen.findByLabelText('Rejected')) as HTMLInputElement;
      fireEvent.click(rejectedRadio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);

      fireEvent.click(sentRadio);

      expect(saveButton.disabled).toBe(true);
    });

    it('Triggers correct service method when clicked by the seller and status has changed', async () => {
      const spy = vi
        .spyOn(orderService, 'changeOrderStatus')
        .mockResolvedValueOnce(generateMockOrder('sent'));

      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
        />,
      );

      const radio = await screen.findByLabelText('Sent');
      fireEvent.click(radio);

      const saveButton = await screen.findByText('Save');
      fireEvent.click(saveButton);

      expect(spy).toHaveBeenCalledWith(1, 'sent');
    });
  });

  describe('Radio buttons', () => {
    it('Are disabled when the order is completed for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are disabled when the order is rejected for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('rejected')}
          status={'rejected'}
          userPosition={'buyer'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are disabled when the order is completed for the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'seller'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are disabled when the order is rejected for the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('rejected')}
          status={'rejected'}
          userPosition={'seller'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are disabled when the order is ordered for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'buyer'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are enabled when the order is sent for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const enabledRadios = Array.from(radioButtons).filter((r) => !r.disabled);

      expect(enabledRadios).toHaveLength(2);
    });

    it('Are enabled when the order is ordered for the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const enabledRadios = Array.from(radioButtons).filter((r) => !r.disabled);

      expect(enabledRadios).toHaveLength(2);
    });

    it('Are enabled when the order is sent for the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'seller'}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const enabledRadios = Array.from(radioButtons).filter((r) => !r.disabled);

      expect(enabledRadios).toHaveLength(2);
    });
  });
});
