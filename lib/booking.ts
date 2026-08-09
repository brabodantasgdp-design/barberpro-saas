export type BookingError =
 | "SERVICE_NOT_AVAILABLE" | "STAFF_CANNOT_PERFORM_SERVICE"
 | "OUTSIDE_WORK_SCHEDULE" | "TIME_BLOCKED" | "TIME_ALREADY_BOOKED"
 | "SHOP_NOT_FOUND" | "UNKNOWN";

export function bookingMessage(code:BookingError){
 const messages:Record<BookingError,string>={
  SERVICE_NOT_AVAILABLE:"Esse serviço não está disponível.",
  STAFF_CANNOT_PERFORM_SERVICE:"Esse profissional não realiza o serviço selecionado.",
  OUTSIDE_WORK_SCHEDULE:"O horário está fora da jornada do profissional.",
  TIME_BLOCKED:"O profissional está indisponível nesse período.",
  TIME_ALREADY_BOOKED:"Esse horário acabou de ser reservado. Escolha outro.",
  SHOP_NOT_FOUND:"Barbearia não encontrada.",
  UNKNOWN:"Não foi possível concluir o agendamento."
 };
 return messages[code];
}
