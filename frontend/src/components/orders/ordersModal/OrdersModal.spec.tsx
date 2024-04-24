import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OrdersModal from './OrdersModal';
import { Order, orderState } from '../../../services/orders/types';
import { orderService } from '../../../services/orders/orderService';
import { orderStates } from '../../../constants/orders';
import { Feedback } from '../../../services/feedback/types';

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

function generateMockFeedback(): Feedback {
  return {
    related_order: 1,
    sender_user: 1,
    rating: 1,
    comment: 'test',
  };
}

describe('OrdersModal component tests', () => {
  describe('Save button', () => {
    it('Is disabled when no option is selected by the seller and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
          feedback={generateMockFeedback()}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is disabled for the buyer when the status is ordered and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled when the seller changes the status from ordered to sent and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
          feedback={generateMockFeedback()}
        />,
      );

      const radio = (await screen.findByLabelText(orderStates.sent)) as HTMLInputElement;
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is disabled for the buyer when the status is sent, but the user has not selected an option and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled for the buyer when the status is sent and the user has selected an option and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const radio = (await screen.findByLabelText(orderStates.completed)) as HTMLInputElement;
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is enabled if the seller chooses a different option and disabled when they revert back to sent and feedback has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'seller'}
          feedback={generateMockFeedback()}
        />,
      );

      const sentRadio = (await screen.findByLabelText(orderStates.sent)) as HTMLInputElement;
      const rejectedRadio = (await screen.findByLabelText(
        orderStates.rejected,
      )) as HTMLInputElement;
      fireEvent.click(rejectedRadio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);

      fireEvent.click(sentRadio);

      expect(saveButton.disabled).toBe(true);
    });

    it('Triggers correct service methods when clicked by the seller and status has changed and feedback has been given', async () => {
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
          feedback={generateMockFeedback()}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.sent);
      fireEvent.click(radio);

      const saveButton = await screen.findByText('Save');
      fireEvent.click(saveButton);

      expect(spy).toHaveBeenCalledWith(1, 'sent');
    });

    it('Triggers correct service methods when clicked by the buyer and status has changed and feedback has been given', async () => {
      const spy = vi
        .spyOn(orderService, 'changeOrderStatus')
        .mockResolvedValueOnce(generateMockOrder('sent'));

      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.completed);
      fireEvent.click(radio);

      const saveButton = await screen.findByText('Save');
      fireEvent.click(saveButton);

      expect(spy).toHaveBeenCalledWith(1, 'completed');
    });

    it('Is enabled when no feedback has been given, regardless of the status, as long as the user is a buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={undefined}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is disabled for the seller, even if there is no feedback, if the seller has not chosen a different option', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'seller'}
          feedback={undefined}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled for the seller if there is no feedback, but a different option has been chosen', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'seller'}
          feedback={undefined}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.rejected);
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
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
          feedback={generateMockFeedback()}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const enabledRadios = Array.from(radioButtons).filter((r) => !r.disabled);

      expect(enabledRadios).toHaveLength(2);
    });
  });

  describe('Rating', () => {
    /*
      For the purposes of these tests, a custom dataset called 'disabled' is used
      due to the way the MUI Rating is rendered
     */
    it('Is disabled when a feedback is passed to the modal for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const rating = document.querySelector('#rating') as HTMLElement;
      expect(rating.dataset.disabled).toBe('true');
    });

    it('Is enabled when no feedback is passed to the modal for the buyer', () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={undefined}
        />,
      );

      const rating = document.querySelector('#rating') as HTMLElement;
      expect(rating.dataset.disabled).toBe('false');
    });

    it('Is disabled for the seller, even if there is no feedback', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'seller'}
          feedback={undefined}
        />,
      );

      const rating = document.querySelector('#rating') as HTMLElement;
      expect(rating.dataset.disabled).toBe('true');
    });
  });

  describe('Comments field', () => {
    it('Is disabled when a feedback is passed to the modal for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
        />,
      );

      const commentsField = (await screen.findByLabelText(/Comment/i)) as HTMLInputElement;
      expect(commentsField.disabled).toBe(true);
    });

    it('Is enabled when no feedback is passed to the modal for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={undefined}
        />,
      );

      const commentsField = (await screen.findByLabelText(/Comment/i)) as HTMLInputElement;
      expect(commentsField.disabled).toBe(false);
    });

    it('Is disabled for the seller, even if there is no feedback', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'seller'}
          feedback={undefined}
        />,
      );

      const commentsField = (await screen.findByLabelText(/Comment/i)) as HTMLInputElement;
      expect(commentsField.disabled).toBe(true);
    });
  });
});
