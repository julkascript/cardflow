import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OrdersModal from './OrdersModal';
import { Order, orderState } from '../../../services/orders/types';
import { orderService } from '../../../services/orders/orderService';
import { orderStates } from '../../../constants/orders';
import { Feedback } from '../../../services/feedback/types';
import { feedbackService } from '../../../services/feedback/feedback';
import '../../../i18next';

function generateMockOrder(status: orderState, date?: Date): Order {
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
    phone_number: '123456789',
    names: 'John Doe',
    status_history: [
      {
        status: 'ordered',
        timestamp: date ? date.toDateString() : new Date('January 17, 2024').toDateString(),
      },
    ],
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
    it('Is disabled when no option is selected by the seller', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is disabled for the buyer when the status is anything but completed / rejected', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radio = (await screen.findByLabelText(orderStates.sent)) as HTMLInputElement;
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is enabled for the buyer when the status is sent and the user has selected an option', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radio = (await screen.findByLabelText(orderStates.completed)) as HTMLInputElement;
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
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

    it('Triggers correct service methods when clicked by the seller and status has changed', async () => {
      const orderServiceSpy = vi
        .spyOn(orderService, 'changeOrderStatus')
        .mockResolvedValueOnce(generateMockOrder('sent'));

      const feedbackServiceSpy = vi.spyOn(feedbackService, 'sendFeedback').mockResolvedValueOnce({
        receiver_user: 1,
        sender_user: 1,
        related_order: 1,
        comment: 'a',
        rating: 1,
      });

      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered')}
          status={'ordered'}
          userPosition={'seller'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.sent);
      fireEvent.click(radio);

      const saveButton = await screen.findByText('Save');
      fireEvent.click(saveButton);

      expect(orderServiceSpy).toHaveBeenCalledWith(1, 'sent');
      expect(feedbackServiceSpy).not.toHaveBeenCalled();
    });

    it('Triggers correct service methods when clicked by the buyer, status has changed and the buyer has not given / cannot give rating', async () => {
      const orderServiceSpy = vi
        .spyOn(orderService, 'changeOrderStatus')
        .mockResolvedValueOnce(generateMockOrder('sent'));

      const feedbackServiceSpy = vi.spyOn(feedbackService, 'sendFeedback').mockResolvedValueOnce({
        receiver_user: 1,
        sender_user: 1,
        related_order: 1,
        comment: 'a',
        rating: 1,
      });

      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.completed);
      fireEvent.click(radio);

      const saveButton = await screen.findByText('Save');
      fireEvent.click(saveButton);

      expect(orderServiceSpy).toHaveBeenCalledWith(1, 'completed');
      expect(feedbackServiceSpy).not.toHaveBeenCalled();
    });

    it('Triggers correct service methods when rating is selected', async () => {
      const orderServiceSpy = vi
        .spyOn(orderService, 'changeOrderStatus')
        .mockResolvedValueOnce(generateMockOrder('sent'));

      const feedbackServiceSpy = vi.spyOn(feedbackService, 'sendFeedback').mockResolvedValueOnce({
        receiver_user: 1,
        sender_user: 1,
        related_order: 1,
        comment: 'a',
        rating: 1,
      });

      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const rating = await screen.findByText(/3 stars/i);
      fireEvent.click(rating);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      fireEvent.click(saveButton);

      expect(orderServiceSpy).not.toHaveBeenCalledWith();
      expect(feedbackServiceSpy).toHaveBeenCalled();

      await waitFor(() => expect(saveButton.disabled).toBe(true));
    });

    it('Is enabled when no feedback has been given, status is completed, the user is a buyer, and a rating has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const rating = await screen.findByText(/3 stars/i);
      fireEvent.click(rating);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is enabled when no feedback has been given, status is rejected, the user is a buyer, and a rating has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('rejected')}
          status={'rejected'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const rating = await screen.findByText(/3 stars/i);
      fireEvent.click(rating);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is disabled for the seller if the seller has not chosen a different option', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'seller'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is enabled for the seller if a different option has been chosen', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'seller'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radio = await screen.findByLabelText(orderStates.rejected);
      fireEvent.click(radio);

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(false);
    });

    it('Is disabled for the buyer when the order is completed and a rating has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed')}
          status={'completed'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
          today={new Date('January 17, 2024')}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });

    it('Is disabled for the buyer when the order is rejected and a rating has been given', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('rejected')}
          status={'rejected'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
          today={new Date('January 17, 2024')}
        />,
      );

      const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });
  });

  describe('Radio buttons', () => {
    it('Are disabled when the order is completed for the buyer', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('completed', new Date('January 5, 2024'))}
          status={'completed'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
          today={new Date('January 17, 2024')}
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
          order={generateMockOrder('rejected', new Date('January 5, 2024'))}
          status={'rejected'}
          userPosition={'buyer'}
          feedback={generateMockFeedback()}
          today={new Date('January 17, 2024')}
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are disabled when the order is ordered for the buyer and ten days have passed', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('ordered', new Date('January 1, 2024'))}
          status={'ordered'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const disabledRadios = Array.from(radioButtons).filter((r) => r.disabled);

      expect(disabledRadios).toHaveLength(2);
    });

    it('Are enabled when the order is sent for the buyer and 10 days have passed', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent', new Date('January 5, 2024'))}
          status={'sent'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 17, 2024')}
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
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
          feedback={undefined}
          today={new Date('January 17, 2024')}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const enabledRadios = Array.from(radioButtons).filter((r) => !r.disabled);

      expect(enabledRadios).toHaveLength(2);
    });

    it('Not received is disabled when 10 days have not passed and the order is sent', async () => {
      render(
        <OrdersModal
          open={true}
          onClose={() => {}}
          order={generateMockOrder('sent')}
          status={'sent'}
          userPosition={'buyer'}
          feedback={undefined}
          today={new Date('January 16, 2024')}
        />,
      );

      const radioButtons = document.querySelectorAll(
        '[role="radiogroup"] input',
      ) as NodeListOf<HTMLInputElement>;

      const radios = Array.from(radioButtons);

      expect(radios[1].disabled).toBe(true);
      expect(radios[0].disabled).toBe(false);
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
          today={new Date('January 17, 2024')}
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
          today={new Date('January 17, 2024')}
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
          today={new Date('January 17, 2024')}
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
          today={new Date('January 17, 2024')}
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
          today={new Date('January 17, 2024')}
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
          today={new Date('January 17, 2024')}
        />,
      );

      const commentsField = (await screen.findByLabelText(/Comment/i)) as HTMLInputElement;
      expect(commentsField.disabled).toBe(true);
    });
  });
});
