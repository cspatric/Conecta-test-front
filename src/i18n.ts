import { createI18n } from 'vue-i18n'

const STORAGE_KEY = 'app_locale'

function detectLocale() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return saved
  const nav = navigator.language?.toLowerCase() || 'pt-br'
  if (nav.startsWith('pt')) return 'pt-BR'
  return 'en'
}

export const messages = {
  'pt-BR': {
    app: {
      title: 'Gerenciador',
      loading: 'carregando…',
      actions: {
        email: 'E-mails',
        newEmail: 'Novo e-mail',
        logout: 'Sair',
        home: 'Início',
        details: 'Ver detalhes',
        add: 'Adicionar',
        manual: 'Manual',
        ai: 'Gemini',
        cancel: 'Cancelar',
        send: 'Enviar',
        reply: 'Responder',
        forward: 'Encaminhar',
        loading: 'Carregando',
        back: 'Voltar',
        language: 'Idioma',
        call: 'Ligar',
        copy: 'copiar',
      },
      search: {
        contactsPlaceholder: 'Pesquisar por nome ou email...',
        mailPlaceholder: 'Buscar por assunto, pessoa, e-mail…',
      },
      contacts: {
        allDomains: 'Todos os domínios',
        headerName: 'nome',
        headerEmail: 'email',
        headerAction: 'ação',
        none: 'Nenhum contato encontrado.',
        loading: 'Carregando contatos…',
        error: 'Erro ao carregar contatos',
      },
      mail: {
        tabs: { inbox: 'Recebidos', sent: 'Enviados' },
        headerSubject: 'assunto',
        headerFrom: 'de',
        headerTo: 'para',
        headerDate: 'data',
        headerAction: 'ação',
        none: 'Nenhum e-mail encontrado.',
        loading: 'Carregando {where}…',
      },
      compose: {
        title: 'Enviar e-mail',
        to: 'Para',
        subject: 'Assunto',
        body: 'Mensagem',
        success: '✅ E-mail enviado com sucesso!',
        errors: {
          toRequired: 'Informe pelo menos um destinatário.',
          toInvalid: 'Há e-mail inválido na lista.',
          subjectRequired: 'Assunto é obrigatório.',
          bodyRequired: 'Mensagem é obrigatória.',
          fail: 'Falha ao enviar o e-mail.',
        },
      },
      contact: {
        title: 'Contato',
        name: 'Nome',
        company: 'Empresa',
        titleLabel: 'Cargo',
        department: 'Departamento',
        location: 'Local',
        birthday: 'Aniversário',
        emails: 'Emails',
        phones: 'Telefones',
        im: 'IDs de Mensageria',
        categories: 'Categorias',
        notes: 'Notas',
        createdAt: 'Criado em:',
        updatedAt: 'Atualizado em:',
        errors: {
          missingId: 'ID do contato não informado',
          loadFail: 'Erro ao carregar contato',
        },
      },
      greetPrefix: 'Boa',
      greetTimes: { day: 'dia', afternoon: 'tarde', evening: 'noite' },
      user: { default: 'Usuário' },
    }
  },
  en: {
    app: {
      title: 'Manager',
      loading: 'loading…',
      actions: {
        email: 'Emails',
        newEmail: 'New email',
        logout: 'Logout',
        home: 'Home',
        details: 'View details',
        add: 'Add',
        manual: 'Manual',
        ai: 'Gemini',
        cancel: 'Cancel',
        send: 'Send',
        reply: 'Reply',
        forward: 'Forward',
        loading: 'Loading',
        back: 'Back',
        language: 'Language',
        call: 'Call',
        copy: 'copy',
      },
      search: {
        contactsPlaceholder: 'Search by name or email...',
        mailPlaceholder: 'Search by subject, person, email…',
      },
      contacts: {
        allDomains: 'All domains',
        headerName: 'name',
        headerEmail: 'email',
        headerAction: 'action',
        none: 'No contacts found.',
        loading: 'Loading contacts…',
        error: 'Failed to load contacts',
      },
      mail: {
        tabs: { inbox: 'Inbox', sent: 'Sent' },
        headerSubject: 'subject',
        headerFrom: 'from',
        headerTo: 'to',
        headerDate: 'date',
        headerAction: 'action',
        none: 'No emails found.',
        loading: 'Loading {where}…',
      },
      compose: {
        title: 'Send email',
        to: 'To',
        subject: 'Subject',
        body: 'Message',
        success: '✅ Email sent successfully!',
        errors: {
          toRequired: 'Enter at least one recipient.',
          toInvalid: 'There is an invalid email in the list.',
          subjectRequired: 'Subject is required.',
          bodyRequired: 'Body is required.',
          fail: 'Failed to send email.',
        },
      },
      contact: {
        title: 'Contact',
        name: 'Name',
        company: 'Company',
        titleLabel: 'Job title',
        department: 'Department',
        location: 'Location',
        birthday: 'Birthday',
        emails: 'Emails',
        phones: 'Phones',
        im: 'IM IDs',
        categories: 'Categories',
        notes: 'Notes',
        createdAt: 'Created at:',
        updatedAt: 'Updated at:',
        errors: {
          missingId: 'Contact ID not provided',
          loadFail: 'Failed to load contact',
        },
      },
      greetPrefix: 'Good',
      greetTimes: { day: 'morning', afternoon: 'afternoon', evening: 'evening' },
      user: { default: 'User' },
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
})

export function setLocale(locale: 'pt-BR' | 'en') {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
}