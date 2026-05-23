import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addBookEntry,
  addMovieEntry,
  deleteMediaEntry,
  getMediaEntries,
  mediaEntriesQueryKey,
  updateMediaEntry,
} from '../api/media';

export const useMediaEntriesQuery = () => {
  return useQuery({
    queryKey: mediaEntriesQueryKey,
    queryFn: getMediaEntries,
  });
};

export const useDeleteMediaMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMediaEntry,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: mediaEntriesQueryKey });
      if (options.onSuccess) {
        await options.onSuccess(...args);
      }
    },
    onError: options.onError,
  });
};

export const useAddBookMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBookEntry,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: mediaEntriesQueryKey });
      if (options.onSuccess) {
        await options.onSuccess(...args);
      }
    },
    onError: options.onError,
  });
};

export const useAddMovieMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMovieEntry,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: mediaEntriesQueryKey });
      if (options.onSuccess) {
        await options.onSuccess(...args);
      }
    },
    onError: options.onError,
  });
};

export const useUpdateMediaEntryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMediaEntry,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: mediaEntriesQueryKey });
      if (options.onSuccess) {
        await options.onSuccess(...args);
      }
    },
    onError: options.onError,
  });
};
