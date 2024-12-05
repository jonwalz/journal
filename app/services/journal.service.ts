import { ApiClient, RequestOptions } from "./api-client";

export class JournalServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "JournalServiceError";
  }
}

interface Journal {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface SingleJournalResponse {
  data: Journal;
}

interface JournalResponse {
  data: Journal[];
}

interface CreateJournalInput {
  title: string;
  content: string;
}

export class JournalService {
  static async getJournals(options: RequestOptions = {}): Promise<Journal[]> {
    try {
      const response = await ApiClient.get<JournalResponse>(
        "/journals",
        options
      );

      return response.data.data;
    } catch (error) {
      throw new JournalServiceError("Failed to fetch journals", error);
    }
  }

  static async getJournalById(id: number): Promise<Journal> {
    try {
      const response = await ApiClient.get<SingleJournalResponse>(
        `/journals/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to fetch journal with id ${id}`,
        error
      );
    }
  }

  static async createJournal(input: CreateJournalInput): Promise<Journal> {
    try {
      const response = await ApiClient.post<SingleJournalResponse>(
        "/journals",
        input
      );
      return response.data.data;
    } catch (error) {
      throw new JournalServiceError("Failed to create journal", error);
    }
  }

  static async updateJournal(
    id: number,
    input: Partial<CreateJournalInput>
  ): Promise<Journal> {
    try {
      const response = await ApiClient.put<SingleJournalResponse>(
        `/journals/${id}`,
        input
      );
      return response.data.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to update journal with id ${id}`,
        error
      );
    }
  }

  static async deleteJournal(id: number): Promise<void> {
    try {
      await ApiClient.delete(`/journals/${id}`);
    } catch (error) {
      throw new JournalServiceError(
        `Failed to delete journal with id ${id}`,
        error
      );
    }
  }
}
