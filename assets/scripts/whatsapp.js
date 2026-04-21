export function generateWhatsAppLink(cart, phoneNumber = "5571988080613") {
  const items = cart.getItems();
  
  if (items.length === 0) return `https://wa.me/${phoneNumber}`;

  let message = `Olá! Gostaria de fazer um pedido na Delícias da Cris:\n\n`;
  message += `*MEU PEDIDO:*\n`;
  
  items.forEach(item => {
    message += `- ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})\n`;
  });

  const total = cart.getTotalPrice();
  message += `\n*Valor Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
  message += `Aguardando confirmação!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
